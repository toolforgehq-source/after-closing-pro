import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { PLANS } from '@/lib/types';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';

export const metadata: Metadata = {
  title: 'Pricing — Homebuilder Warranty Software',
  description:
    'After Closing Pro pricing for homebuilders. Starter $199/mo (up to 15 homes), Growth $399/mo (up to 50 homes), and Pro $799/mo (unlimited homes). Every plan includes AI triage, coverage guidance, and trade scheduling.',
  alternates: { canonical: '/pricing' },
};

const planOrder = ['starter', 'growth', 'pro'] as const;

export default function PricingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'After Closing Pro',
    description:
      'AI-powered warranty management software for homebuilders — triage, coverage guidance, trade scheduling, and documentation.',
    offers: planOrder.map((key) => ({
      '@type': 'Offer',
      name: PLANS[key].name,
      price: String(PLANS[key].price),
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(PLANS[key].price),
        priceCurrency: 'USD',
        billingIncrement: 1,
        unitText: 'MONTH',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple pricing for builders
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Plans scale with the number of active warranty homes you manage. Every plan includes AI
            issue triage, warranty coverage guidance, trade assignment, and hands-off scheduling.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {planOrder.map((key) => {
            const plan = PLANS[key];
            const highlighted = key === 'growth';
            return (
              <div
                key={key}
                className={`flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
                  highlighted ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200'
                }`}
              >
                {highlighted && (
                  <span className="mb-3 inline-block w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${key}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold ${
                    highlighted
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Not sure which plan fits? Start with Starter and upgrade as your active warranty homes
          grow.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
