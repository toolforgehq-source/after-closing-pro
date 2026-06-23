'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/types';

export default function BillingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleSelectPlan(plan: string) {
    setLoadingPlan(plan);

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoadingPlan(null);
      alert(data.error || 'Failed to start checkout');
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-2 text-sm text-gray-500">
          30-day money-back guarantee. Cancel anytime.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
          <Card
            key={key}
            className={key === 'growth' ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                {key === 'growth' && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    Most Popular
                  </span>
                )}
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelectPlan(key)}
                loading={loadingPlan === key}
                className={`mt-6 w-full ${
                  key === 'growth'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : ''
                }`}
                variant={key === 'growth' ? 'primary' : 'outline'}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
