'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'account' | 'company' | 'confirm'>('account');
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
    const phone = (formData.get('phone') as string) || '';
    const slug = slugify(companyName) + '-' + Date.now().toString(36);

    const supabase = createClient();
    const origin = window.location.origin;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          company_phone: phone,
          company_slug: slug,
        },
        emailRedirectTo: `${origin}/api/auth/callback?next=/dashboard/billing`,
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

    // If email confirmation is disabled, the user gets a session immediately.
    // Create company/profile and redirect.
    if (authData.session) {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyName,
          slug,
          phone: phone || null,
          warranty_period_months: 12,
        })
        .select('id')
        .single();

      if (companyError) {
        setError(companyError.message);
        setLoading(false);
        return;
      }

      await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'builder_admin',
        company_id: company.id,
      });

      router.push('/dashboard/billing');
      return;
    }

    // Email confirmation is enabled — show the confirmation screen
    setStep('confirm');
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size="lg" />
          </Link>
          <p className="mt-2 text-sm text-gray-500">
            {step === 'account'
              ? 'Create your builder account'
              : step === 'company'
                ? 'Set up your company'
                : 'Almost there'}
          </p>
        </div>

        {step === 'confirm' ? (
          <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We sent a confirmation link to{' '}
              <span className="font-medium text-gray-900">{email}</span>.
              Click the link in the email to activate your account.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              Didn&apos;t get it? Check your spam folder or{' '}
              <button
                type="button"
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.resend({ type: 'signup', email });
                }}
                className="text-blue-600 hover:underline"
              >
                resend the email
              </button>
              .
            </p>
          </div>
        ) : step === 'account' ? (
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
