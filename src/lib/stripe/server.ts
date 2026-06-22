import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || '',
  growth: process.env.STRIPE_GROWTH_PRICE_ID || '',
  pro: process.env.STRIPE_PRO_PRICE_ID || '',
} as const;
