'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { formatSlot } from '@/lib/schedule';

export default function ConfirmForm({
  ticketId,
  token,
  slots,
}: {
  ticketId: string;
  token: string;
  slots: string[];
}) {
  const [selected, setSelected] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState('');

  async function handleConfirm() {
    if (!selected) {
      setError('Please select a time.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/schedule/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId, token, slot: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setConfirmed(data.slot || formatSlot(selected));
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  }

  if (confirmed) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
        <p className="mt-2 font-semibold text-gray-900">Appointment confirmed</p>
        <p className="mt-1 text-sm text-gray-600">
          See you on <strong>{confirmed}</strong>. Your builder and trade have been notified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <label
          key={slot}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
            selected === slot ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name="slot"
            value={slot}
            checked={selected === slot}
            onChange={() => setSelected(slot)}
            className="h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-900">{formatSlot(slot)}</span>
        </label>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleConfirm} loading={submitting} size="lg" className="w-full">
        Confirm This Time
      </Button>
    </div>
  );
}
