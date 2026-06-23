import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata?.company_id;
      if (!companyId) break;

      const status = subscription.status === 'active' ? 'active'
        : subscription.status === 'past_due' ? 'past_due'
        : subscription.status === 'trialing' ? 'trialing'
        : 'canceled';

      await supabase
        .from('subscriptions')
        .upsert({
          company_id: companyId,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          plan: subscription.metadata?.plan || 'starter',
          status,
          current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
        }, {
          onConflict: 'company_id',
        });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const companyId = subscription.metadata?.company_id;
      if (!companyId) break;

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('company_id', companyId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
