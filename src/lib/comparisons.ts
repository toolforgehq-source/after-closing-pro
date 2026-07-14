export type ComparisonRow = {
  feature: string;
  acp: string;
  competitor: string;
};

export type Comparison = {
  slug: string;
  competitor: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** One-line summary shown on the hub page. */
  summary: string;
  /** Short intro paragraph on the comparison page. */
  intro: string;
  /** What the competitor is, in neutral terms, from their official page. */
  competitorOverview: string;
  rows: ComparisonRow[];
  /** Honest "who each fits best" guidance. */
  bestForAcp: string;
  bestForCompetitor: string;
  /** Points we are careful about — where the competitor is stronger. */
  competitorStrengths: string[];
  source: {
    label: string;
    url: string;
    reviewed: string;
    note?: string;
  };
};

export const comparisons: Comparison[] = [
  {
    slug: 'buildertrend',
    competitor: 'Buildertrend',
    title: 'After Closing Pro vs Buildertrend',
    metaTitle: 'After Closing Pro vs Buildertrend — Warranty Management Compared',
    metaDescription:
      'An honest comparison of After Closing Pro and Buildertrend for post-closing warranty management: AI triage, coverage guidance, trade scheduling, pricing, and which type of builder each fits best.',
    summary:
      'Buildertrend is an all-in-one construction management platform with a warranty module; After Closing Pro is a focused AI warranty tool.',
    intro:
      'Buildertrend and After Closing Pro solve different-sized problems. Buildertrend is a broad construction-management platform that runs projects end to end and includes warranty claim management as one module. After Closing Pro does one thing — post-closing warranty — and adds AI triage, coverage guidance, and an automated trade-scheduling loop on top of it. Here is how they line up on warranty specifically.',
    competitorOverview:
      'Per Buildertrend’s official construction warranty page, its warranty software lets homeowners submit documented claims (photos, videos, details, and urgency), lets teams manage claims from anywhere, schedule service appointments inside a claim, and communicate internally through messages, daily logs, to-dos, and a customer portal. Warranty is one part of a wider platform that also covers scheduling, budgeting, selections, invoices, time clock, and file storage.',
    rows: [
      {
        feature: 'Product focus',
        acp: 'Post-closing warranty only — purpose-built for it',
        competitor: 'Full construction-management platform; warranty is one module',
      },
      {
        feature: 'AI issue triage',
        acp: 'Yes — AI asks follow-ups, suggests safe troubleshooting, classifies, rates urgency',
        competitor: 'Not advertised on the warranty page',
      },
      {
        feature: 'Warranty coverage guidance',
        acp: 'Yes — soft guidance on maintenance vs. likely-covered, builder can override',
        competitor: 'Not advertised on the warranty page',
      },
      {
        feature: 'Trade scheduling',
        acp: 'Automated loop: trade proposes times → homeowner confirms → 24-hour reminders',
        competitor: 'Schedule service appointments within a claim (manual)',
      },
      {
        feature: 'Homeowner submission',
        acp: 'One link, no login; photo intake',
        competitor: 'Homeowners submit claims with photos, videos, and details',
      },
      {
        feature: 'Documentation / audit trail',
        acp: 'Full ticket timeline of every message, photo, decision, status change',
        competitor: 'Documented claims plus platform-wide records',
      },
      {
        feature: 'Integrations',
        acp: 'None published today',
        competitor: 'QuickBooks, Xero, Gusto, HubSpot, Salesforce, Pipedrive, Pro Xtra (platform-level)',
      },
      {
        feature: 'Pricing transparency',
        acp: 'Public self-serve pricing ($199 / $399 / $799 per month)',
        competitor: 'Not listed on the warranty page',
      },
    ],
    bestForAcp:
      'Small-to-mid-sized builders who want warranty handled well without adopting a whole project-management suite — and who value AI triage, coverage guidance, hands-off scheduling, and transparent monthly pricing.',
    bestForCompetitor:
      'Builders and remodelers who want a single platform to run the entire construction project — scheduling, budgets, client communication, selections, invoicing — with warranty tracking included alongside everything else.',
    competitorStrengths: [
      'Runs the whole build, not just warranty — one login for scheduling, budgeting, client comms, and more.',
      'A large, established integration ecosystem (accounting, payroll, CRM) at the platform level.',
      'Well-known brand many builders and their trades already use.',
    ],
    source: {
      label: 'Buildertrend — Construction Warranty Management (official page)',
      url: 'https://buildertrend.com/project-management/construction-warranty/',
      reviewed: 'Reviewed June 30, 2026',
      note: 'The live page returned a bot-protection challenge on the review date; feature claims above were taken from the most recent archived copy of the same official page (Internet Archive snapshot, December 4, 2023). Verify current details on the live page before relying on them.',
    },
  },
  {
    slug: 'avidwarranty',
    competitor: 'AvidWarranty by ECI',
    title: 'After Closing Pro vs AvidWarranty by ECI',
    metaTitle: 'After Closing Pro vs AvidWarranty by ECI — AI Warranty Compared',
    metaDescription:
      'An honest comparison of After Closing Pro and AvidWarranty by ECI: AI triage, coverage guidance, scheduling, channels (email vs. text), integrations, and which type of builder each fits best.',
    summary:
      'AvidWarranty by ECI is an AI warranty platform that plugs into ERP/CRM and supports text intake; After Closing Pro is a focused, self-serve AI warranty tool for smaller builders.',
    intro:
      'AvidWarranty by ECI is the closest direct competitor to After Closing Pro — both are AI-powered homebuilder warranty platforms. The differences are about focus, channels, integrations, and who each is built to serve. Here is an honest side-by-side based on AvidWarranty’s official product page.',
    competitorOverview:
      'Per ECI’s official AvidWarranty page, it is a homebuilder warranty management platform with AI that automatically analyzes, categorizes, and routes homeowner requests in real time using contextual Q&A, de-escalating common concerns. Homeowners can submit requests via text, email, or an online portal, all consolidated into one dashboard. It includes a self-help knowledge base, ticket and task management, multichannel communication, 24/7 access, photo/document uploads, and reporting, and it is “integration ready” with ERP and CRM systems. ECI states it is built for builders of all sizes.',
    rows: [
      {
        feature: 'Product focus',
        acp: 'AI warranty for small-to-mid-sized builders',
        competitor: 'AI warranty for builders of all sizes, including enterprise/production builders',
      },
      {
        feature: 'AI triage',
        acp: 'Yes — follow-up questions, safe troubleshooting, classification, urgency',
        competitor: 'Yes — real-time analyze/categorize/route with contextual Q&A',
      },
      {
        feature: 'Warranty coverage guidance',
        acp: 'Yes — soft maintenance vs. likely-covered guidance, builder override',
        competitor: 'Not described in those terms on the product page',
      },
      {
        feature: 'Intake channels',
        acp: 'Online link + email (no SMS/texting)',
        competitor: 'Text, email, and online portal',
      },
      {
        feature: 'Trade scheduling',
        acp: 'Automated loop: trade proposes times → homeowner confirms → 24-hour reminders',
        competitor: 'Ticket and task management; scheduling loop not described on the page',
      },
      {
        feature: 'Integrations',
        acp: 'None published today',
        competitor: 'Integration-ready with ERP, CRM, and builder software',
      },
      {
        feature: 'Self-help knowledge base',
        acp: 'Not a separate feature (AI troubleshooting is inline)',
        competitor: 'Yes — dedicated self-help knowledge base',
      },
      {
        feature: 'Pricing transparency',
        acp: 'Public self-serve pricing ($199 / $399 / $799 per month)',
        competitor: 'Not publicly listed (contact ECI)',
      },
    ],
    bestForAcp:
      'Small-to-mid-sized builders who want an AI warranty tool they can turn on themselves, with transparent monthly pricing, no homeowner or trade logins, and an automated trade-scheduling loop — without an ERP integration project.',
    bestForCompetitor:
      'Builders — including larger and enterprise/production builders — who need warranty to plug into existing ERP and CRM systems, want text-message intake alongside email, or want a self-help knowledge base as part of the platform.',
    competitorStrengths: [
      'Multichannel intake including text/SMS, which After Closing Pro does not offer (email only).',
      'Integration-ready with ERP and CRM systems for larger builders with existing back-office software.',
      'A dedicated self-help knowledge base and the backing of ECI, an established construction-software vendor.',
    ],
    source: {
      label: 'AvidWarranty by ECI — Homebuilder Warranty Management Platform (official page)',
      url: 'https://www.ecisolutions.com/products/avidwarranty/',
      reviewed: 'Reviewed June 30, 2026',
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
