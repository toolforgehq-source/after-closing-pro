export type CaseStudyMetric = {
  /** e.g. "Direct warranty calls" */
  label: string;
  /** e.g. "-61%" — leave real numbers only; never fabricate. */
  value: string;
  /** Optional context, e.g. "vs. the 3 months before ACP". */
  note?: string;
};

export type CaseStudy = {
  slug: string;
  /** Builder / company name (with permission). */
  builder: string;
  location: string;
  /** Homes completed per year, or similar sizing context. */
  size: string;
  /** One-line result headline — only publish numbers you can prove. */
  headline: string;
  /** The situation before ACP. */
  challenge: string;
  /** What they did with ACP. */
  approach: string;
  /** Measurable outcomes. Only include verified metrics. */
  metrics: CaseStudyMetric[];
  /** Optional direct quote from the builder. */
  quote?: { text: string; attribution: string };
  /** Date the results were measured/collected. */
  reviewed: string;
};

/**
 * Published case studies. INTENTIONALLY EMPTY.
 *
 * This is the ready-to-use template. When a real builder has measurable,
 * verifiable results (and has given permission to be named and quoted), add
 * an entry here — only with numbers you can prove. Do NOT add fabricated,
 * illustrative, or "example" metrics; the page is wired to publish anything
 * in this array, so an entry here goes live.
 *
 * Reference shape for the first real entry:
 *
 * {
 *   slug: 'acme-homes',
 *   builder: 'Acme Homes',
 *   location: 'Fargo, ND',
 *   size: '~30 homes / year',
 *   headline: 'Cut direct warranty calls by X% and scheduled trade visits Y% faster',
 *   challenge: 'How warranty was handled before ACP, in the builder’s words.',
 *   approach: 'How they rolled out ACP and what changed day to day.',
 *   metrics: [
 *     { label: 'Direct warranty calls', value: '-X%', note: 'vs. the 3 months before ACP' },
 *     { label: 'Time to scheduled appointment', value: '-Y%' },
 *   ],
 *   quote: { text: 'A real quote.', attribution: 'Owner, Acme Homes' },
 *   reviewed: 'Measured Month Year',
 * }
 */
export const caseStudies: CaseStudy[] = [];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
