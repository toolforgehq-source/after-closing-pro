import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Bot,
  Scale,
  CalendarCheck,
  Ticket,
  Wrench,
  ShieldCheck,
  Zap,
  CheckCircle,
  MessageSquare,
  Camera,
  Users,
  Paintbrush,
  ArrowRight,
} from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';

export const metadata: Metadata = {
  title: 'Features — AI Warranty Management for Homebuilders',
  description:
    'Everything After Closing Pro does: AI issue triage, warranty coverage guidance, hands-off trade scheduling, ticket management, photo intake, documentation, and a homeowner portal — built for homebuilders.',
  alternates: { canonical: '/features' },
};

const features = [
  {
    icon: Bot,
    title: 'AI Issue Triage',
    desc: 'When a homeowner submits an issue, the AI asks the right follow-up questions, suggests safe troubleshooting (like resetting a tripped GFCI or breaker), classifies the problem, and rates urgency. Simple issues get resolved before they ever become a service call.',
  },
  {
    icon: Scale,
    title: 'Warranty Coverage Guidance',
    desc: 'Each issue is checked against your builder-specific warranty terms. The AI softly guides homeowners when something looks like normal maintenance versus a likely-covered warranty item. It never hard-denies — homeowners can always submit — and you make the final call with a one-click override.',
  },
  {
    icon: CalendarCheck,
    title: 'Hands-Off Trade Scheduling',
    desc: 'Assign a trade and the scheduling loop runs itself: the trade proposes appointment times, the homeowner confirms one, and the ticket flips to Scheduled. Both sides get a 24-hour reminder. You can reschedule, set a time manually, or cancel at any point.',
  },
  {
    icon: Ticket,
    title: 'Ticket Management',
    desc: 'Every issue is tracked from submission to sign-off with a clear status: new, in triage, assigned, scheduled, in progress, completed, closed. No more sticky notes, text threads, or "I forgot about that."',
  },
  {
    icon: Wrench,
    title: 'Trade Routing',
    desc: 'The AI recommends the right trade for each issue. Assign in one click and the trade receives an email with the address, photos, homeowner answers, and full context — before they show up.',
  },
  {
    icon: ShieldCheck,
    title: 'Documentation & Audit Trail',
    desc: 'Every message, photo, decision, and status change is logged on the ticket timeline. If a warranty dispute comes up months later, you have a clean, time-stamped record of exactly what happened.',
  },
  {
    icon: Zap,
    title: 'Emergency Escalation',
    desc: 'Potential emergencies — gas smells, active water damage, electrical hazards — are flagged as high urgency so they surface immediately instead of sitting in a queue.',
  },
  {
    icon: Camera,
    title: 'Photo Intake',
    desc: 'Homeowners upload photos as part of the submission, so issues arrive with visual context attached instead of a blurry picture in a separate text.',
  },
  {
    icon: MessageSquare,
    title: 'Homeowner Portal',
    desc: 'Homeowners get one simple link — no login required — to submit issues, answer AI questions, and confirm appointment times. A far better experience than texting and hoping for a reply.',
  },
  {
    icon: CheckCircle,
    title: 'Homeowner Sign-Off',
    desc: 'Homeowners confirm when an issue is resolved, closing the loop with a clean record that protects the builder.',
  },
  {
    icon: Users,
    title: 'Team Members',
    desc: 'Add your team so warranty coordination is shared, not stuck with one person. Seats scale with your plan.',
  },
  {
    icon: Paintbrush,
    title: 'Custom Branding',
    desc: 'Put your company name and branding on the homeowner-facing experience so it feels like your process, not a third-party tool.',
  },
];

export default function FeaturesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'After Closing Pro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'AI-powered warranty management software for homebuilders. Triage post-closing warranty issues, guide coverage, assign trades, and schedule repairs — all documented.',
    offers: {
      '@type': 'Offer',
      price: '199',
      priceCurrency: 'USD',
    },
    featureList: features.map((f) => f.title),
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything After Closing Pro does
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            After Closing Pro is warranty-management software for homebuilders. It gives every
            homeowner one link to submit post-closing issues, uses AI to triage and guide coverage,
            and turns real problems into clean, documented tickets your team and trades can act on —
            with scheduling handled over email.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <feature.icon className="h-7 w-7 text-blue-600" />
              <h2 className="mt-3 text-lg font-semibold text-gray-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            See how it fits your warranty workflow
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Give homeowners one link and let the AI handle the first pass. Start in minutes.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-100"
            >
              See how it works
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
