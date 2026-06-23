import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - After Closing Pro',
  description: 'Privacy Policy for After Closing Pro warranty management platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">After Closing Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-2xl px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 22, 2026</p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <div className="mt-3 space-y-3">
              <p>
                <span className="font-semibold text-gray-800">Account Information:</span> When you
                create an account, we collect your name, email address, company name, and optional
                phone number.
              </p>
              <p>
                <span className="font-semibold text-gray-800">Payment Information:</span> When you
                subscribe, payment details are processed securely through Stripe. We do not store
                your credit card numbers on our servers.
              </p>
              <p>
                <span className="font-semibold text-gray-800">Warranty Data:</span> Content you
                and your homeowners submit through the Service, including issue descriptions, photos,
                trade contact information, home addresses, and homeowner contact details.
              </p>
              <p>
                <span className="font-semibold text-gray-800">Usage Data:</span> We collect
                information about how you use the Service, including pages visited, features used,
                and actions taken within the platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">2. How We Use Your Information</h2>
            <div className="mt-3 space-y-3">
              <p>We use your information to:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Provide and maintain the Service</li>
                <li>Process warranty tickets and route them to assigned trades</li>
                <li>Power AI-driven issue triage and troubleshooting suggestions</li>
                <li>Send email notifications about ticket assignments and updates</li>
                <li>Process subscription payments and manage billing</li>
                <li>Communicate with you about your account, updates, and support requests</li>
                <li>Improve the Service and develop new features</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">3. AI Data Processing</h2>
            <p className="mt-3">
              Warranty issue descriptions and related content are processed by AI services (OpenAI)
              to provide triage, classification, and troubleshooting suggestions. This data is sent
              to OpenAI&apos;s API for processing and is subject to{' '}
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenAI&apos;s privacy policy
              </a>
              . OpenAI does not use data sent via their API to train their models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">4. Information Sharing</h2>
            <div className="mt-3 space-y-3">
              <p>We do not sell your personal information. We share data only in these cases:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  <span className="font-semibold text-gray-800">Service Providers:</span> We use
                  third-party services to operate the platform (Supabase for database, Stripe for
                  payments, Resend for email, OpenAI for AI processing, Vercel for hosting).
                </li>
                <li>
                  <span className="font-semibold text-gray-800">Trade Assignments:</span> When you
                  assign a warranty ticket to a trade, the trade receives an email containing ticket
                  details, homeowner contact information, and relevant photos.
                </li>
                <li>
                  <span className="font-semibold text-gray-800">Legal Requirements:</span> We may
                  disclose information if required by law, regulation, or legal process.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">5. Data Security</h2>
            <p className="mt-3">
              We implement industry-standard security measures to protect your data. All data is
              transmitted over encrypted connections (HTTPS/TLS). Database access is controlled
              through row-level security policies ensuring multi-tenant data isolation between
              builder accounts. Payment processing is handled by Stripe, a PCI-compliant payment
              processor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">6. Data Retention</h2>
            <p className="mt-3">
              We retain your data for as long as your account is active. If you cancel your
              subscription, your data remains accessible for 30 days. After that, you may request
              a data export. We will delete your data upon written request, subject to any legal
              retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">7. Your Rights</h2>
            <div className="mt-3 space-y-3">
              <p>You have the right to:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Export your data in a standard format</li>
                <li>Opt out of non-essential email communications</li>
              </ul>
              <p>
                To exercise these rights, contact us at{' '}
                <a href="mailto:support@afterclosingpro.com" className="text-blue-600 hover:underline">
                  support@afterclosingpro.com
                </a>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">8. Cookies and Tracking</h2>
            <p className="mt-3">
              We use essential cookies required for authentication and session management. We may
              use analytics tools to understand how the Service is used. We do not use cookies for
              advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">9. Children&apos;s Privacy</h2>
            <p className="mt-3">
              The Service is not intended for use by individuals under the age of 18. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">10. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this privacy policy from time to time. We will notify you of material
              changes by email or through the Service. Your continued use after changes take effect
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">11. Contact</h2>
            <p className="mt-3">
              If you have questions about this privacy policy or how we handle your data, contact
              us at{' '}
              <a href="mailto:support@afterclosingpro.com" className="text-blue-600 hover:underline">
                support@afterclosingpro.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">After Closing Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy
            </Link>
            <Link href="/why" className="text-sm text-gray-500 hover:text-gray-700">
              Why I Built This
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
