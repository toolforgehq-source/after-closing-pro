'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Home as HomeIcon, Plus, Calendar, User, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import type { Home, Company, Subscription } from '@/lib/types';
import { PLANS } from '@/lib/types';
import { formatDate, isWarrantyActive } from '@/lib/utils';
import { isAdminEmail, getAdminSubscription } from '@/lib/admin';

export default function HomesPage() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHomes() {
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

      const [homesResult, companyResult, subResult] = await Promise.all([
        supabase
          .from('homes')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false }),
        supabase.from('companies').select('*').eq('id', profile.company_id).single(),
        supabase.from('subscriptions').select('*').eq('company_id', profile.company_id).eq('status', 'active').single(),
      ]);

      setHomes((homesResult.data as Home[]) ?? []);
      setCompany(companyResult.data as Company | null);
      const sub = isAdminEmail(user.email)
        ? getAdminSubscription(profile.company_id)
        : (subResult.data as Subscription | null);
      setSubscription(sub);
      setLoading(false);
    }

    loadHomes();
  }, []);

  function copyIntakeUrl(home: Home) {
    if (!company) return;
    const url = `${window.location.origin}/submit/${company.slug}?home=${home.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(home.id);
    setTimeout(() => setCopiedId(null), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Homes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage warranty homes and homeowner access
            {subscription && (() => {
              const plan = subscription.plan as keyof typeof PLANS;
              const max = PLANS[plan]?.maxHomes;
              if (max && max > 0) {
                return <span className="ml-2 text-gray-400">({homes.length}/{max} used)</span>;
              }
              return <span className="ml-2 text-gray-400">({homes.length} homes)</span>;
            })()}
          </p>
        </div>
        <Link href="/dashboard/homes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Home
          </Button>
        </Link>
      </div>

      {homes.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={HomeIcon}
              title="No homes yet"
              description="Add your first home to start managing warranty requests."
              action={
                <Link href="/dashboard/homes/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Home
                  </Button>
                </Link>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homes.map((home) => {
            const active = isWarrantyActive(home.warranty_end_date);
            return (
              <Card key={home.id} className="overflow-hidden">
                <div className={`h-1 ${active ? 'bg-green-500' : 'bg-gray-300'}`} />
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {home.address}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {home.city}, {home.state} {home.zip}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {active ? 'Active' : 'Expired'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="h-3.5 w-3.5" />
                      <span>{home.homeowner_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Warranty: {formatDate(home.warranty_start_date)} &ndash;{' '}
                        {formatDate(home.warranty_end_date)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/dashboard/homes/${home.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyIntakeUrl(home)}
                    >
                      {copiedId === home.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
