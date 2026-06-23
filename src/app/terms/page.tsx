import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - After Closing Pro',
  description: 'Terms of Service for After Closing Pro warranty management platform.',
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 22, 2026</p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using After Closing Pro (&ldquo;the Service&rdquo;), operated by After
              Closing Pro LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree
              to be bound by these Terms of Service. If you do not agree to these terms, do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">2. Description of Service</h2>
            <p className="mt-3">
              After Closing Pro is a software-as-a-service platform that helps residential
              homebuilders manage post-closing warranty requests. The Service includes AI-powered
              issue triage, ticket management, trade assignment, email notifications, and homeowner
              intake portals.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Account Registration</h2>
            <p className="mt-3">
              You must provide accurate and complete information when creating an account. You are
              responsible for maintaining the security of your account credentials and for all
              activity that occurs under your account. You must notify us immediately of any
              unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">4. Subscription and Payment</h2>
            <div className="mt-3 space-y-3">
              <p>
                The Service is offered through monthly subscription plans. By subscribing, you
                authorize us to charge your payment method on a recurring monthly basis at the rate
                for your selected plan.
              </p>
              <p>
                <span className="font-semibold text-gray-800">30-Day Money-Back Guarantee:</span>{' '}
                If you are not satisfied within the first 30 days of your initial subscription, you
                may request a full refund by contacting us at support@afterclosingpro.com.
              </p>
              <p>
                Prices are subject to change with 30 days&apos; written notice. You may cancel your
                subscription at any time through your account settings or by contacting us. Your
                access will continue through the end of your current billing period.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">5. Acceptable Use</h2>
            <div className="mt-3 space-y-3">
              <p>You agree not to:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Upload malicious content, viruses, or harmful code</li>
                <li>Resell or redistribute the Service without written permission</li>
                <li>Use the Service to store or transmit content that infringes on intellectual property rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">6. Data and Content</h2>
            <div className="mt-3 space-y-3">
              <p>
                You retain ownership of all content you upload to the Service, including photos,
                ticket descriptions, homeowner information, and trade contact details. We do not
                claim ownership of your data.
              </p>
              <p>
                You grant us a limited license to process, store, and display your content solely
                for the purpose of providing the Service. We will not sell your data to third parties.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">7. AI-Powered Features</h2>
            <p className="mt-3">
              The Service uses artificial intelligence to triage warranty issues, suggest
              troubleshooting steps, and classify ticket urgency. AI suggestions are provided as
              guidance only and do not constitute professional advice. You are responsible for
              reviewing AI-generated recommendations and making final decisions regarding warranty
              claims and trade assignments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">8. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, After Closing Pro shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not
              limited to loss of profits, data, or business opportunities, arising out of or related
              to your use of the Service. Our total liability shall not exceed the amount you paid
              for the Service in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">9. Disclaimer of Warranties</h2>
            <p className="mt-3">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
              warranties of any kind, either express or implied. We do not warrant that the Service
              will be uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">10. Termination</h2>
            <p className="mt-3">
              We may suspend or terminate your account if you violate these terms or engage in
              conduct that we determine is harmful to the Service or other users. Upon termination,
              you may request an export of your data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">11. Changes to Terms</h2>
            <p className="mt-3">
              We may update these terms from time to time. We will notify you of material changes by
              email or through the Service. Your continued use after changes take effect constitutes
              acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">12. Contact</h2>
            <p className="mt-3">
              If you have questions about these terms, contact us at{' '}
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
