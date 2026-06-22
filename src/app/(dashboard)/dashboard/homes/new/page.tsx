'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      setError('No company found. Please complete setup first.');
      setLoading(false);
      return;
    }

    const closingDate = formData.get('closing_date') as string;
    const warrantyMonths = parseInt(formData.get('warranty_months') as string) || 12;
    const warrantyStart = new Date(closingDate);
    const warrantyEnd = new Date(closingDate);
    warrantyEnd.setMonth(warrantyEnd.getMonth() + warrantyMonths);

    const { error: insertError } = await supabase.from('homes').insert({
      company_id: profile.company_id,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
      homeowner_name: formData.get('homeowner_name') as string,
      homeowner_email: formData.get('homeowner_email') as string,
      homeowner_phone: (formData.get('homeowner_phone') as string) || null,
      closing_date: closingDate,
      warranty_start_date: warrantyStart.toISOString(),
      warranty_end_date: warrantyEnd.toISOString(),
      model_name: (formData.get('model_name') as string) || null,
      notes: (formData.get('notes') as string) || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/homes');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/homes" className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Home</h1>
          <p className="mt-1 text-sm text-gray-500">Register a new home for warranty tracking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Property Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="address"
              name="address"
              label="Street Address"
              placeholder="123 Main St"
              required
            />
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <Input id="city" name="city" label="City" placeholder="Austin" required />
              </div>
              <div className="col-span-1">
                <Input id="state" name="state" label="State" placeholder="TX" required />
              </div>
              <div className="col-span-2">
                <Input id="zip" name="zip" label="ZIP" placeholder="78701" required />
              </div>
            </div>
            <Input
              id="model_name"
              name="model_name"
              label="Home Model / Floor Plan (Optional)"
              placeholder="e.g., The Oakridge"
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Homeowner</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="homeowner_name"
              name="homeowner_name"
              label="Homeowner Name"
              placeholder="John Smith"
              required
            />
            <Input
              id="homeowner_email"
              name="homeowner_email"
              label="Homeowner Email"
              type="email"
              placeholder="john@example.com"
              required
            />
            <Input
              id="homeowner_phone"
              name="homeowner_phone"
              label="Homeowner Phone (Optional)"
              type="tel"
              placeholder="(555) 123-4567"
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Warranty</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="closing_date"
              name="closing_date"
              label="Closing Date"
              type="date"
              required
            />
            <Input
              id="warranty_months"
              name="warranty_months"
              label="Warranty Period (Months)"
              type="number"
              defaultValue="12"
              min="1"
              max="120"
            />
            <Textarea
              id="notes"
              name="notes"
              label="Notes (Optional)"
              placeholder="Any special notes about this home or warranty..."
              rows={3}
            />
          </CardContent>
        </Card>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/dashboard/homes">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" loading={loading}>
            Add Home
          </Button>
        </div>
      </form>
    </div>
  );
}
