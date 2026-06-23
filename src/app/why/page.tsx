import Link from 'next/link';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';

export default function WhyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
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

      {/* Content */}
      <article className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Why I Built After Closing Pro
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          I&apos;m a homebuilder, and I built this because warranty after closing should not
          be managed through texts, phone calls, memory, and scattered trade messages.
        </p>

        <div className="mt-12 space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              I know the problem because I&apos;ve lived it
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                After closing, the job is technically done. The keys are handed over. The homeowner
                is happy. You move on to the next build.
              </p>
              <p>
                Except you don&apos;t. Because two weeks later, the homeowner texts you about an
                outlet that stopped working. Then a door that won&apos;t latch. Then a leak under
                the kitchen sink. Then &ldquo;is this covered under warranty?&rdquo;
              </p>
              <p>
                And suddenly you&apos;re back in it — answering questions, coordinating trades,
                asking for photos, trying to figure out if this is something you need to fix or
                something the homeowner should handle. Every builder I know deals with this. None
                of us had a good system for it.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              The problem is not just the repair
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                The actual repair is usually the easy part. The hard part is everything around it.
              </p>
              <p>
                Collecting the right information. Getting photos that actually show the issue.
                Figuring out if it&apos;s warranty or just maintenance the homeowner should be
                handling. Routing the issue to the right trade. Making sure the trade has what
                they need before they show up. Documenting what happened. Following up. And making
                sure nothing falls through the cracks.
              </p>
              <p>
                Most of us manage all of that through texts, phone calls, and memory. There&apos;s
                no system, no documentation, and no paper trail. When a warranty dispute comes up
                six months later, nobody has a clean record of what happened.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Why After Closing Pro exists
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                After Closing Pro gives homeowners one simple place to submit warranty issues. They
                describe the problem, upload photos, and our AI takes it from there — asking the
                right follow-up questions, suggesting simple troubleshooting for things like tripped
                GFCIs or breakers, and filtering out maintenance items before they hit your phone.
              </p>
              <p>
                When an issue is real, it becomes a clean ticket with an AI summary, urgency rating,
                trade recommendation, photos, and full documentation. You review it, assign a trade,
                and move on. No more scattered texts. No more &ldquo;what was that issue at the
                Evergreen house again?&rdquo;
              </p>
              <p>
                It&apos;s the system I wished I had. So I built it.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Built for builders, homeowners, and trades
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                <span className="font-semibold text-gray-800">Homeowners</span> get a better
                experience. Instead of texting or calling and hoping someone responds, they have a
                clear place to submit issues and get immediate AI-guided help.
              </p>
              <p>
                <span className="font-semibold text-gray-800">Builders</span> get fewer messy
                interruptions. Simple maintenance issues get resolved before they become service
                calls. Real warranty issues arrive as organized tickets, not 9pm texts.
              </p>
              <p>
                <span className="font-semibold text-gray-800">Trades</span> get cleaner
                information. When they get called in, they already have the address, photos, issue
                description, homeowner answers, and context they need — before they show up.
              </p>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Ready to clean up warranty after closing?
          </h2>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" /> Back to Home
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">After Closing Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/why" className="text-sm text-gray-500 hover:text-gray-700">
              Why I Built This
            </Link>
            <p className="text-sm text-gray-400">
              Built by a builder, for builders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
