import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';

export const metadata: Metadata = {
  title: 'FAQ — After Closing Pro Warranty Software',
  description:
    'Frequently asked questions about After Closing Pro: who it’s for, how AI triage and warranty coverage guidance work, how trade scheduling works, whether homeowners need a login, notifications, pricing, and data.',
  alternates: { canonical: '/faq' },
};

const faqs = [
  {
    q: 'Who is After Closing Pro for?',
    a: 'Homebuilders who manage warranty after closing — especially small-to-mid-sized builders who currently handle warranty through texts, phone calls, and memory. It is used by builders, their homeowners, and the trades they assign work to.',
  },
  {
    q: 'What does the AI actually do?',
    a: 'When a homeowner submits an issue, the AI asks relevant follow-up questions, suggests safe troubleshooting (like resetting a tripped GFCI or breaker), classifies the issue, rates urgency, flags potential emergencies, and recommends the right trade. It resolves simple issues before they become service calls and turns real ones into clean tickets.',
  },
  {
    q: 'How does warranty coverage guidance work?',
    a: 'You set your builder-specific warranty terms. The AI checks each issue against them and softly guides homeowners when something looks like normal maintenance versus a likely-covered warranty item. It never hard-denies a request — homeowners can always submit — and you can override any classification with one click.',
  },
  {
    q: 'How does trade scheduling work?',
    a: 'You assign a trade to a ticket, and the scheduling loop runs over email: the trade proposes appointment times, the homeowner confirms one, and the ticket automatically flips to Scheduled. Both the trade and homeowner receive a 24-hour reminder. You can reschedule, set a time manually, or cancel at any point.',
  },
  {
    q: 'Do homeowners or trades need to create an account?',
    a: 'No. Homeowners submit issues and confirm appointment times through a simple link with no login required. Trades propose times through a secure link in their assignment email. Only the builder and their team log in to the dashboard.',
  },
  {
    q: 'Does After Closing Pro send text messages?',
    a: 'No. All notifications are handled by email — assignment notices, proposed times, confirmations, and 24-hour reminders. There is no SMS/texting at this time.',
  },
  {
    q: 'Is everything documented?',
    a: 'Yes. Every message, photo, decision, and status change is recorded on the ticket timeline, giving you a clean, time-stamped audit trail if a warranty question or dispute comes up later.',
  },
  {
    q: 'How much does it cost?',
    a: 'Plans are billed monthly and scale with your active warranty homes: Starter is $199/month (up to 15 homes, 2 team members), Growth is $399/month (up to 50 homes, 5 team members), and Pro is $799/month (unlimited homes and team members). See the pricing page for full details.',
  },
  {
    q: 'How do I get started?',
    a: 'Create a builder account, set your warranty terms, and share your warranty link with homeowners. Most builders are up and running in minutes.',
  },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
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

      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Straight answers about how After Closing Pro works for builders, homeowners, and trades.
        </p>

        <dl className="mt-12 space-y-8">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-gray-100 pb-8">
              <dt className="text-lg font-semibold text-gray-900">{item.q}</dt>
              <dd className="mt-2 text-base leading-relaxed text-gray-600">{item.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Still have questions?</h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Reach out and we&apos;ll help, or jump straight in and see it for yourself.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-100"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
