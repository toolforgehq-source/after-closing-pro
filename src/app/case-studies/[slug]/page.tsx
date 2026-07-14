import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { caseStudies, getCaseStudy } from '@/lib/case-studies';

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = getCaseStudy(params.slug);
  if (!cs) return {};
  return {
    title: `${cs.builder} — After Closing Pro Case Study`,
    description: cs.headline,
    alternates: { canonical: `/case-studies/${cs.slug}` },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug);
  if (!cs) notFound();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Case study
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {cs.headline}
        </h1>
        <p className="mt-3 text-gray-600">
          {cs.builder} · {cs.location} · {cs.size}
        </p>

        {cs.metrics.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {cs.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center"
              >
                <div className="text-3xl font-extrabold text-gray-900">{m.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-700">{m.label}</div>
                {m.note && <div className="mt-1 text-xs text-gray-500">{m.note}</div>}
              </div>
            ))}
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">The challenge</h2>
          <p className="mt-3 leading-relaxed text-gray-600">{cs.challenge}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">What they did</h2>
          <p className="mt-3 leading-relaxed text-gray-600">{cs.approach}</p>
        </section>

        {cs.quote && (
          <blockquote className="mt-10 border-l-4 border-blue-200 bg-blue-50 p-6">
            <p className="text-lg italic leading-relaxed text-gray-800">“{cs.quote.text}”</p>
            <footer className="mt-3 text-sm font-medium text-gray-600">
              — {cs.quote.attribution}
            </footer>
          </blockquote>
        )}

        <p className="mt-8 text-xs text-gray-400">{cs.reviewed}</p>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Want results like these?</h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Give homeowners one link and let After Closing Pro handle triage, coverage guidance, and
            scheduling.
          </p>
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
