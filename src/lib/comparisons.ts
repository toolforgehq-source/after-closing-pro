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
  {
    slug: 'warrantyhub',
    competitor: 'WarrantyHub',
    title: 'After Closing Pro vs WarrantyHub',
    metaTitle: 'After Closing Pro vs WarrantyHub — Homebuilder Warranty Compared',
    metaDescription:
      'An honest comparison of After Closing Pro and WarrantyHub for residential warranty management: AI triage, coverage guidance, trade dispatch, intake channels, pricing, and which type of builder each fits best.',
    summary:
      'WarrantyHub is a purpose-built residential warranty platform with a self-service homeowner portal and SMS trade dispatch; After Closing Pro is a focused AI warranty tool with coverage guidance and transparent pricing.',
    intro:
      'WarrantyHub and After Closing Pro are both purpose-built for post-closing residential warranty — this is a close, direct comparison. WarrantyHub emphasizes a self-service homeowner portal, automated trade dispatch, and multi-community claim tracking across a broader warranty platform. After Closing Pro emphasizes AI issue triage, coverage guidance, and an automated trade-scheduling loop, with transparent published pricing. Here is an honest side-by-side based on WarrantyHub’s official homebuilder page.',
    competitorOverview:
      'Per WarrantyHub’s official homebuilder page, it is purpose-built residential warranty management software that covers the full post-construction warranty lifecycle: homeowner claim submission, trade coordination and dispatch (it shows trades assigned via SMS), work-order management, and resolution tracking, with branded homeowner self-service portals and real-time tracking across multiple communities. WarrantyHub is offered by Bid Box Pro, Inc. as part of a broader warranty platform that also serves home-warranty companies, manufacturers, automotive/TPAs, and others, and it advertises claims management, analytics, a customer portal, warranty tracking, registration, and policy management.',
    rows: [
      {
        feature: 'Product focus',
        acp: 'Post-closing warranty for small-to-mid-sized builders',
        competitor: 'Residential warranty within a broader multi-industry warranty platform',
      },
      {
        feature: 'AI issue triage',
        acp: 'Yes — AI asks follow-ups, suggests safe troubleshooting, classifies, rates urgency',
        competitor: 'Not advertised as AI triage on the homebuilder page',
      },
      {
        feature: 'Warranty coverage guidance',
        acp: 'Yes — soft guidance on maintenance vs. likely-covered, builder can override',
        competitor: 'Not advertised on the homebuilder page',
      },
      {
        feature: 'Trade scheduling / dispatch',
        acp: 'Automated loop: trade proposes times → homeowner confirms → 24-hour reminders',
        competitor: 'Automated trade coordination and dispatch (shown assigning trades via SMS)',
      },
      {
        feature: 'Homeowner submission',
        acp: 'One link, no login; photo intake',
        competitor: 'Branded homeowner self-service portal for claim submission',
      },
      {
        feature: 'Intake channels',
        acp: 'Online link + email (no SMS/texting)',
        competitor: 'Self-service portal with SMS notifications to trades',
      },
      {
        feature: 'Analytics / reporting',
        acp: 'Ticket timeline and status; no analytics dashboard published today',
        competitor: 'Yes — warranty analytics is an advertised feature',
      },
      {
        feature: 'Multi-community scale',
        acp: 'Built for small-to-mid-sized builders',
        competitor: 'Real-time tracking across multiple communities; states $1B+ contracts managed',
      },
      {
        feature: 'Pricing transparency',
        acp: 'Public self-serve pricing ($199 / $399 / $799 per month)',
        competitor: 'Three named tiers (Essentials, Professional, Enterprise) with free trial; dollar amounts not published (start trial or contact sales)',
      },
    ],
    bestForAcp:
      'Small-to-mid-sized builders who want AI-assisted triage and coverage guidance, an automated trade-scheduling loop, and transparent published monthly pricing they can sign up for themselves — without needing a multi-community analytics platform.',
    bestForCompetitor:
      'Builders who want a branded self-service homeowner portal, SMS-based trade dispatch, warranty analytics, and real-time tracking across many communities — or organizations that also run warranty operations beyond homebuilding (manufacturers, TPAs) on one platform.',
    competitorStrengths: [
      'Branded homeowner self-service portal and SMS trade dispatch, which After Closing Pro does not offer (email only).',
      'Advertised warranty analytics and real-time tracking across multiple communities for larger, multi-community builders.',
      'An established platform (states $1B+ in contracts managed) spanning multiple warranty industries beyond homebuilding.',
    ],
    source: {
      label: 'WarrantyHub — Homebuilder Warranty Software (official page)',
      url: 'https://warrantyhub.com/homebuilder-warranty-software/',
      reviewed: 'Reviewed June 30, 2026',
    },
  },
  {
    slug: 'digscare',
    competitor: 'DigsCare',
    title: 'After Closing Pro vs DigsCare',
    metaTitle: 'After Closing Pro vs DigsCare (Digs) — Warranty Software Compared',
    metaDescription:
      'An honest comparison of After Closing Pro and DigsCare by Digs: AI warranty triage, coverage guidance, trade scheduling, punch-list walkthroughs, pricing, and which type of builder each fits best.',
    summary:
      'DigsCare is the post-handoff/warranty add-on to Digs, a pre-construction and document-collaboration suite with floorplan-pinned punch lists; After Closing Pro is a standalone AI warranty tool with triage, coverage guidance, and automated scheduling.',
    intro:
      'DigsCare (by Digs) and After Closing Pro both handle post-closing homeowner warranty, but they come at it from different directions. DigsCare is an add-on to Digs, a broader pre-construction and document-collaboration platform, and leans on visual, floorplan-pinned punch lists and homeowner handoff. After Closing Pro is a standalone AI warranty tool centered on issue triage, coverage guidance, and an automated trade-scheduling loop. Here is an honest side-by-side based on the official DigsCare and Digs pricing pages.',
    competitorOverview:
      'Per the official DigsCare page, DigsCare helps builders “continue to wow after the build,” covering homeowner handoff, warranty management, and life-long ownership. It supports walkthroughs and punch lists where blue-tape items are pinned directly to a digital floorplan, comments and photo uploads, and task assignment with completion tracking, and it manages homeowner warranty tickets from start to finish. DigsCare is an add-on to Digs (Digs Inc.), whose broader product covers pre-construction collaboration, 2D/3D floorplans, file management with digital signatures, and an “AskDigs” AI chat for finding documents. Per the Digs pricing page, DigsPro is $59/month (billed annually) with DigsCare offered as a +$17/month add-on, and Digs Enterprise (custom integrations, analytics including warranty metrics) is contact-sales.',
    rows: [
      {
        feature: 'Product focus',
        acp: 'Standalone post-closing AI warranty tool',
        competitor: 'Warranty/handoff add-on to a pre-construction & document-collaboration suite',
      },
      {
        feature: 'AI issue triage',
        acp: 'Yes — AI asks follow-ups, suggests safe troubleshooting, classifies, rates urgency',
        competitor: 'Not advertised for warranty; Digs offers an “AskDigs” AI chat for finding documents',
      },
      {
        feature: 'Warranty coverage guidance',
        acp: 'Yes — soft guidance on maintenance vs. likely-covered, builder can override',
        competitor: 'Not advertised on the DigsCare page',
      },
      {
        feature: 'Trade scheduling',
        acp: 'Automated loop: trade proposes times → homeowner confirms → 24-hour reminders',
        competitor: 'Task assignment and completion tracking; automated scheduling loop not described',
      },
      {
        feature: 'Punch list / walkthroughs',
        acp: 'Not a separate feature — focused on post-closing warranty tickets',
        competitor: 'Yes — blue-tape items pinned to a digital floorplan at move-in and one-year check-ins',
      },
      {
        feature: 'Homeowner submission',
        acp: 'One link, no login; photo intake',
        competitor: 'Homeowner handoff and warranty tickets with comments and photo uploads',
      },
      {
        feature: 'Document storage',
        acp: 'Ticket timeline with attached photos; not a document vault',
        competitor: 'Yes — file management with unlimited storage and homeowner handoff docs',
      },
      {
        feature: 'Pricing transparency',
        acp: 'Public self-serve pricing ($199 / $399 / $799 per month)',
        competitor: 'Public pricing: DigsPro $59/mo (billed annually) + DigsCare add-on $17/mo; Enterprise contact-sales',
      },
    ],
    bestForAcp:
      'Small-to-mid-sized builders who specifically want AI warranty triage, coverage guidance, and an automated trade-scheduling loop as a standalone tool — without adopting a broader pre-construction/document platform.',
    bestForCompetitor:
      'Builders who want warranty handled inside a broader Digs workflow — visual punch-list walkthroughs pinned to floorplans, document collaboration and homeowner handoff, and a lower entry price — especially if they already use Digs for pre-construction.',
    competitorStrengths: [
      'Visual punch-list walkthroughs with items pinned directly to a digital floorplan, which After Closing Pro does not offer.',
      'Part of a broader suite (document management, 2D/3D floorplans, homeowner handoff) with a lower published entry price.',
      'Homeowner handoff and document storage for life-long ownership, beyond warranty tickets alone.',
    ],
    source: {
      label: 'DigsCare by Digs — official product & pricing pages',
      url: 'https://digs.com/digscare',
      reviewed: 'Reviewed June 30, 2026',
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
