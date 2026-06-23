'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Wrench, Plus, Mail, Phone, Tag } from 'lucide-react';
import type { Trade, TicketCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

function getTradeCategoryLabel(trade: Trade): string {
  if (trade.category === 'other' && trade.notes) {
    return trade.notes;
  }
  return CATEGORY_LABELS[trade.category] || trade.category;
}

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('trades')
      .select('*')
      .eq('company_id', profile.company_id)
      .order('name');

    setTrades((data as Trade[]) ?? []);
    setLoading(false);
  }

  async function handleAddTrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) return;

    const category = formData.get('category') as TicketCategory;
    const customCategory = (formData.get('custom_category') as string)?.trim() || null;

    await supabase.from('trades').insert({
      company_id: profile.company_id,
      name: formData.get('name') as string,
      company_name: formData.get('company_name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      category,
      notes: category === 'other' && customCategory ? customCategory : (formData.get('notes') as string) || null,
    });

    setShowDialog(false);
    setSaving(false);
    setSelectedCategory('');
    loadTrades();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trades</h1>
          <p className="mt-1 text-sm text-gray-500">Your trade partners for warranty work</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Trade
        </Button>
      </div>

      {trades.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Wrench}
              title="No trades yet"
              description="Add your trade partners to assign them warranty tickets."
              action={
                <Button onClick={() => setShowDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Trade
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => (
            <Card key={trade.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-50 p-2">
                    <Wrench className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{trade.name}</h3>
                    <p className="text-xs text-gray-500">{trade.company_name}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{getTradeCategoryLabel(trade)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${trade.email}`} className="text-blue-600 hover:underline">
                      {trade.email}
                    </a>
                  </div>
                  {trade.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{trade.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setSelectedCategory('');
        }}
        title="Add Trade"
      >
        <form onSubmit={handleAddTrade} className="space-y-4">
          <Input id="name" name="name" label="Contact Name" placeholder="Mike Johnson" required />
          <Input
            id="company_name"
            name="company_name"
            label="Company Name"
            placeholder="Johnson Electric"
            required
          />
          <Select
            id="category"
            name="category"
            label="Trade Category"
            options={categoryOptions}
            placeholder="Select category..."
            required
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          {selectedCategory === 'other' && (
            <Input
              id="custom_category"
              name="custom_category"
              label="Specify Trade Type"
              placeholder="e.g. Framer, Insulation, Stucco..."
              required
            />
          )}
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="mike@johnsonelectric.com"
            required
          />
          <Input
            id="phone"
            name="phone"
            label="Phone (Optional)"
            type="tel"
            placeholder="(555) 123-4567"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setShowDialog(false);
                setSelectedCategory('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add Trade
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
