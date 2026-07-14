import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { comparisons } from '@/lib/comparisons';

const hubTitle = 'Compare — After Closing Pro vs Other Warranty Software';
const hubDescription =
  'Honest, sourced comparisons of After Closing Pro against other homebuilder warranty software — Buildertrend, AvidWarranty by ECI, WarrantyHub, and DigsCare — with a clear read on which type of builder each fits best.';

export const metadata: Metadata = {
  title: hubTitle,
  description: hubDescription,
  alternates: { canonical: '/compare' },
  openGraph: {
    type: 'website',
    url: '/compare',
    title: hubTitle,
    description: hubDescription,
    images: [{ url: '/og/compare.png', width: 1200, height: 630, alt: hubTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: hubTitle,
    description: hubDescription,
    images: ['/og/compare.png'],
  },
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How After Closing Pro compares
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Every comparison below is built from the competitor’s own official pages, cites the
            source and the date we reviewed it, and only compares features that are publicly
            verifiable. We tell you where each product is the better fit — we do not claim After
            Closing Pro wins a category unless the evidence supports it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-gray-900">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                Read the comparison
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
