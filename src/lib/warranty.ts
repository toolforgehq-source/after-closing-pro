import type { Company } from '@/lib/types';

export interface WarrantyCoverage {
  workmanshipMonths: number;
  systemsMonths: number;
  structuralMonths: number;
  excludedItems: string;
  coverageNotes: string;
}

// Industry-standard new-home warranty baseline (roughly the framework most
// builder warranties and state new-home warranty statutes follow). Used as the
// default for builders who haven't customized their own coverage terms.
export const DEFAULT_WARRANTY_COVERAGE: WarrantyCoverage = {
  workmanshipMonths: 12,
  systemsMonths: 24,
  structuralMonths: 120,
  excludedItems: [
    'Normal wear and tear',
    'Nail pops, drywall cracks and settling cracks after the first year',
    'Caulking and grout maintenance (tubs, showers, sinks, countertops, trim)',
    'Homeowner or third-party damage, abuse, neglect, or improper maintenance',
    'Damage from failure to perform routine homeowner maintenance',
    'Landscaping, sod, plantings, and grading changes after closing',
    'Cosmetic issues reported after the first year (paint touch-ups, minor scuffs)',
    'Changes, alterations, or additions made by the homeowner',
    'Appliances and items covered by a separate manufacturer warranty',
    'Damage from severe weather, floods, or other acts of nature',
  ].join('\n'),
  coverageNotes: '',
};

export function getWarrantyCoverage(
  company: Pick<
    Company,
    | 'warranty_workmanship_months'
    | 'warranty_systems_months'
    | 'warranty_structural_months'
    | 'warranty_excluded_items'
    | 'warranty_coverage_notes'
  > | null | undefined
): WarrantyCoverage {
  if (!company) return DEFAULT_WARRANTY_COVERAGE;
  return {
    workmanshipMonths: company.warranty_workmanship_months ?? DEFAULT_WARRANTY_COVERAGE.workmanshipMonths,
    systemsMonths: company.warranty_systems_months ?? DEFAULT_WARRANTY_COVERAGE.systemsMonths,
    structuralMonths: company.warranty_structural_months ?? DEFAULT_WARRANTY_COVERAGE.structuralMonths,
    excludedItems:
      company.warranty_excluded_items && company.warranty_excluded_items.trim().length > 0
        ? company.warranty_excluded_items
        : DEFAULT_WARRANTY_COVERAGE.excludedItems,
    coverageNotes: company.warranty_coverage_notes ?? '',
  };
}

export function buildCoverageContext(coverage: WarrantyCoverage): string {
  const lines = [
    `- Workmanship & materials (finishes, minor defects): covered for ${coverage.workmanshipMonths} months from closing`,
    `- Systems (plumbing, electrical, HVAC, mechanical): covered for ${coverage.systemsMonths} months from closing`,
    `- Major structural components: covered for ${coverage.structuralMonths} months from closing`,
  ];
  if (coverage.excludedItems.trim()) {
    lines.push('', 'Commonly NOT covered (normal maintenance / homeowner responsibility):');
    coverage.excludedItems
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((item) => lines.push(`- ${item}`));
  }
  if (coverage.coverageNotes.trim()) {
    lines.push('', 'Additional builder coverage notes:', coverage.coverageNotes.trim());
  }
  return lines.join('\n');
}

export type CoverageVerdict = 'covered' | 'not_covered' | 'unclear';

// Resolves the effective coverage verdict: a builder override always wins,
// otherwise fall back to the AI's warranty likelihood assessment.
export function effectiveCoverageVerdict(
  coverageOverride: string | null | undefined,
  aiWarrantyLikelihood: string | null | undefined
): CoverageVerdict {
  if (coverageOverride === 'covered') return 'covered';
  if (coverageOverride === 'not_covered') return 'not_covered';
  switch (aiWarrantyLikelihood) {
    case 'likely_warranty':
      return 'covered';
    case 'likely_maintenance':
    case 'likely_not_warranty':
      return 'not_covered';
    default:
      return 'unclear';
  }
}
