export type ScheduleStatus = 'awaiting_trade' | 'proposed' | 'confirmed' | 'cancelled';

export const MAX_PROPOSED_SLOTS = 3;

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://www.afterclosingpro.com';
}

export function proposeUrl(ticketId: string, token: string): string {
  return `${appUrl()}/schedule/${ticketId}?token=${token}`;
}

export function confirmUrl(ticketId: string, token: string): string {
  return `${appUrl()}/schedule/${ticketId}/confirm?token=${token}`;
}

/** Human-friendly rendering of an ISO datetime, e.g. "Tue, Jul 15 at 9:00 AM". */
export function formatSlot(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${date} at ${time}`;
}

/** Validate + normalize proposed slots submitted by a trade. */
export function normalizeSlots(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    if (typeof raw !== 'string') continue;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) continue;
    const iso = d.toISOString();
    if (seen.has(iso)) continue;
    seen.add(iso);
    out.push(iso);
    if (out.length >= MAX_PROPOSED_SLOTS) break;
  }
  return out;
}
