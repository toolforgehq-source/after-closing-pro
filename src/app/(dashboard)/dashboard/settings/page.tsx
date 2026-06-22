'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import type { Company, Profile } from '@/lib/types';

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData as Profile | null);

      if (profileData?.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .single();
        setCompany(companyData as Company | null);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleSaveCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    await supabase
      .from('companies')
      .update({
        name: formData.get('name') as string,
        phone: (formData.get('phone') as string) || null,
        email: (formData.get('email') as string) || null,
        website: (formData.get('website') as string) || null,
        address: (formData.get('address') as string) || null,
        warranty_period_months: parseInt(formData.get('warranty_period_months') as string) || 12,
        emergency_instructions: (formData.get('emergency_instructions') as string) || null,
      })
      .eq('id', company.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function copyPortalUrl() {
    if (!company) return;
    navigator.clipboard.writeText(`${window.location.origin}/submit/${company.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your company and account settings</p>
      </div>

      {/* Portal URL */}
      {company && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Homeowner Portal</h2>
            <p className="text-sm text-gray-500">
              Share this link with homeowners to submit warranty requests
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {typeof window !== 'undefined' ? window.location.origin : ''}/submit/{company.slug}
              </code>
              <Button variant="outline" size="sm" onClick={copyPortalUrl}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Settings */}
      {company && (
        <form onSubmit={handleSaveCompany}>
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900">Company Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="name"
                name="name"
                label="Company Name"
                defaultValue={company.name}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="phone"
                  name="phone"
                  label="Phone"
                  type="tel"
                  defaultValue={company.phone ?? ''}
                />
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  defaultValue={company.email ?? ''}
                />
              </div>
              <Input
                id="website"
                name="website"
                label="Website"
                defaultValue={company.website ?? ''}
              />
              <Input
                id="address"
                name="address"
                label="Address"
                defaultValue={company.address ?? ''}
              />
              <Input
                id="warranty_period_months"
                name="warranty_period_months"
                label="Default Warranty Period (Months)"
                type="number"
                defaultValue={company.warranty_period_months}
                min="1"
                max="120"
              />
              <Textarea
                id="emergency_instructions"
                name="emergency_instructions"
                label="Emergency Instructions"
                placeholder="Instructions shown to homeowners for emergency issues..."
                defaultValue={company.emergency_instructions ?? ''}
                rows={4}
              />
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-3">
                <Button type="submit" loading={saving}>
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
                {saved && <Badge variant="success">Changes saved</Badge>}
              </div>
            </CardFooter>
          </Card>
        </form>
      )}

      {/* Account Info */}
      {profile && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Account</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{profile.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm text-gray-900 capitalize">{profile.role.replace('_', ' ')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
