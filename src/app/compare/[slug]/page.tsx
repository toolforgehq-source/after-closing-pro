import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { comparisons, getComparison } from '@/lib/comparisons';

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getComparison(params.slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug);
  if (!c) notFound();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-16">
        <Link
          href="/compare"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← All comparisons
        </Link>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {c.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{c.intro}</p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">What {c.competitor} is</h2>
          <p className="mt-3 leading-relaxed text-gray-600">{c.competitorOverview}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">Feature-by-feature</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 pr-4 font-semibold text-gray-900">Feature</th>
                  <th className="py-3 pr-4 font-semibold text-blue-700">After Closing Pro</th>
                  <th className="py-3 font-semibold text-gray-900">{c.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-3 pr-4 text-gray-600">{row.acp}</td>
                    <td className="py-3 text-gray-600">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Best fit for After Closing Pro
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{c.bestForAcp}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Best fit for {c.competitor}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{c.bestForCompetitor}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Where {c.competitor} is stronger
          </h2>
          <ul className="mt-4 space-y-2">
            {c.competitorStrengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm leading-relaxed text-gray-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-sm font-semibold text-gray-900">Source</h2>
          <p className="mt-2 text-sm text-gray-600">
            <a
              href={c.source.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
            >
              {c.source.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <span className="mt-1 block text-gray-500">{c.source.reviewed}</span>
            {c.source.note && (
              <span className="mt-2 block text-xs leading-relaxed text-gray-500">
                {c.source.note}
              </span>
            )}
          </p>
        </section>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            See if After Closing Pro fits your warranty workflow
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-600">
            Give homeowners one link, let the AI handle the first pass, and let scheduling run
            itself. Start in minutes.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-100"
            >
              See all features
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
