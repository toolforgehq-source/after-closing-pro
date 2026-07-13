import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';

export const metadata: Metadata = {
  title: 'How It Works — Homebuilder Warranty Management',
  description:
    'How After Closing Pro works, step by step: homeowner submits an issue, AI triages and guides coverage, the builder gets a clean ticket, a trade is assigned, and scheduling is handled automatically over email.',
  alternates: { canonical: '/how-it-works' },
};

const steps = [
  {
    n: '1',
    title: 'Homeowner submits an issue',
    body: 'You give each homeowner one simple warranty link at closing. When something comes up, they open the link, describe the problem, and upload photos. No app to download, no login to create.',
  },
  {
    n: '2',
    title: 'AI triages and troubleshoots',
    body: 'The AI asks targeted follow-up questions and suggests safe troubleshooting first — for example, checking a tripped GFCI or breaker. Many simple issues resolve right here, without ever reaching you.',
  },
  {
    n: '3',
    title: 'AI guides warranty coverage',
    body: 'Each issue is checked against your builder-specific warranty terms. When something looks like normal maintenance, the homeowner gets a gentle heads-up; when it looks covered, it moves forward. Guidance is soft — homeowners can always submit, and you can override any classification.',
  },
  {
    n: '4',
    title: 'You get a clean ticket',
    body: 'Real issues become organized tickets with an AI summary, urgency rating, recommended trade, photos, the homeowner’s answers, and the address. You review it in your dashboard instead of digging through texts.',
  },
  {
    n: '5',
    title: 'Assign a trade',
    body: 'Assign the recommended trade in one click. They receive an email with everything they need — address, issue, photos, and context — so they’re prepared before they show up.',
  },
  {
    n: '6',
    title: 'Scheduling runs itself',
    body: 'The trade proposes appointment times by email, the homeowner confirms one, and the ticket flips to Scheduled. Both sides get a 24-hour reminder. You can reschedule, set a time manually, or cancel at any point.',
  },
  {
    n: '7',
    title: 'Everything is documented',
    body: 'Every message, photo, decision, and status change is logged on the ticket timeline — a clean, time-stamped record that protects you if a warranty question comes up later.',
  },
];

export default function HowItWorksPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How After Closing Pro manages homebuilder warranty issues',
    description:
      'The end-to-end flow from homeowner submission to a scheduled, documented warranty repair.',
    step: steps.map((s) => ({
      '@type': 'HowToStep',
      position: Number(s.n),
      name: s.title,
      text: s.body,
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
          How After Closing Pro works
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          From the homeowner&apos;s first message to a scheduled, documented repair — here&apos;s the
          full flow, and exactly where the AI does the work so you don&apos;t have to.
        </p>

        <ol className="mt-12 space-y-8">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-5">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
                {step.n}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{step.title}</h2>
                <p className="mt-1 text-base leading-relaxed text-gray-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Ready to stop chasing warranty texts?</h2>
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
