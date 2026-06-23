'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'account' | 'company'>('account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('company');
  }

  async function handleCompanySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get('company_name') as string;

    const supabase = createClient();

    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError('Failed to create account');
      setLoading(false);
      return;
    }

    // Create company
    const slug = slugify(companyName) + '-' + Date.now().toString(36);
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        slug,
        phone: (formData.get('phone') as string) || null,
        warranty_period_months: 12,
      })
      .select('id')
      .single();

    if (companyError) {
      setError(companyError.message);
      setLoading(false);
      return;
    }

    // Create profile
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: 'builder_admin',
      company_id: company.id,
    });

    router.push(`/dashboard/billing`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">After Closing Pro</span>
          </Link>
          <p className="mt-2 text-sm text-gray-500">
            {step === 'account' ? 'Create your builder account' : 'Set up your company'}
          </p>
        </div>

        {step === 'account' ? (
          <form onSubmit={handleAccountSubmit} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <Input
              id="full_name"
              label="Your Name"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Button type="submit" size="lg" className="w-full">
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCompanySubmit} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <Input
              id="company_name"
              name="company_name"
              label="Company Name"
              placeholder="Smith Custom Homes"
              required
            />
            <Input
              id="phone"
              name="phone"
              label="Company Phone (Optional)"
              type="tel"
              placeholder="(555) 123-4567"
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Create Account
            </Button>

            <button
              type="button"
              onClick={() => setStep('account')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <SignupForm />;
}
