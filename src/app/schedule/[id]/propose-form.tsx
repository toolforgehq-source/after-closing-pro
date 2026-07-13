'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, CheckCircle, CalendarClock } from 'lucide-react';
import { MAX_PROPOSED_SLOTS } from '@/lib/schedule';

export default function ProposeForm({ ticketId, token }: { ticketId: string; token: string }) {
  const [slots, setSlots] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function updateSlot(i: number, value: string) {
    setSlots((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  function addSlot() {
    setSlots((prev) => (prev.length < MAX_PROPOSED_SLOTS ? [...prev, ''] : prev));
  }

  function removeSlot(i: number) {
    setSlots((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    const chosen = slots.filter((s) => s.trim().length > 0);
    if (chosen.length === 0) {
      setError('Please add at least one time.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/schedule/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          token,
          slots: chosen.map((s) => new Date(s).toISOString()),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setDone(true);
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
        <p className="mt-2 font-semibold text-gray-900">Times sent to the homeowner</p>
        <p className="mt-1 text-sm text-gray-600">
          We&apos;ve emailed your proposed times. You&apos;ll be notified once the homeowner confirms one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slots.map((slot, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-500">Option {i + 1}</label>
            <input
              type="datetime-local"
              value={slot}
              onChange={(e) => updateSlot(i, e.target.value)}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {slots.length > 1 && (
            <button
              type="button"
              onClick={() => removeSlot(i)}
              className="mt-5 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Remove time"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}

      {slots.length < MAX_PROPOSED_SLOTS && (
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" /> Add another time
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleSubmit} loading={submitting} size="lg" className="w-full">
        <CalendarClock className="mr-2 h-4 w-4" />
        Send Times to Homeowner
      </Button>
    </div>
  );
}
