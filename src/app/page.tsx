import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Bot,
  Ticket,
  Wrench,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Zap,
  ClipboardList,
} from 'lucide-react';
import { PLANS } from '@/lib/types';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">After Closing Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/why"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Why I Built This
            </Link>
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/65" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Stop being the warranty department{' '}
            <span className="text-blue-400">after closing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-200">
            I built After Closing Pro because I know what it feels like to close a home
            and still get dragged back into every outlet, leak, door adjustment, and
            &ldquo;is this warranty?&rdquo; text. Give homeowners one simple warranty link.
            Our AI collects photos, asks the right follow-up questions, filters out
            maintenance issues, routes real problems to the right trade, and documents everything.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#example"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              See Example Ticket
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-300">
            Built by a homebuilder who got tired of managing warranty through texts, calls,
            memory, and scattered trade messages.
          </p>
        </div>
      </section>

      {/* Builder Pain - Emotional Section */}
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Built from the problems builders actually deal with
          </h2>
          <div className="mt-8 space-y-4 text-center text-base leading-relaxed text-gray-600">
            <p>
              Warranty work is not just the repair.
            </p>
            <p className="text-gray-800 font-medium">
              It is the 9pm homeowner text.
              The missing photo.
              The trade asking for the address again.
              The homeowner calling about a GFCI reset.
              The &ldquo;I thought you were handling that&rdquo; conversation.
              The forgotten punch item that turns into a dispute three months later.
            </p>
            <p className="mt-6 text-gray-700">
              After Closing Pro gives every homeowner one place to submit warranty issues,
              then turns messy requests into clean, documented tickets your team and trades
              can actually act on.
            </p>
          </div>
        </div>
      </section>

      {/* This is what warranty really looks like */}
      <section className="border-b border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            This is what warranty really looks like
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              'Homeowner texts you at night: "The outlet stopped working."',
              'You ask for photos, but they send one blurry picture.',
              'The trade wants the lot number, address, and background again.',
              'You send someone out and it ends up being maintenance, not warranty.',
              'A small issue gets forgotten because it lived in a text thread.',
              'Months later, nobody has a clean record of what happened.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-5 py-4">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-base font-semibold text-gray-800">
            That is the mess After Closing Pro is built to clean up.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-center text-gray-600">Three simple steps to warranty sanity</p>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Homeowner Submits Issue</h3>
              <p className="mt-2 text-sm text-gray-600">
                Give homeowners a simple link at closing. They describe the issue, upload photos, and our AI takes it from there.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">AI Triages the Issue</h3>
              <p className="mt-2 text-sm text-gray-600">
                AI asks smart follow-up questions, suggests safe troubleshooting, and filters out simple issues before they hit your phone.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">You Get a Clean Ticket</h3>
              <p className="mt-2 text-sm text-gray-600">
                Real issues become organized tickets with AI summaries, trade recommendations, and urgency ratings. Assign a trade in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Ticket */}
      <section id="example" className="border-y border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Example: Kitchen outlet not working
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">See exactly how After Closing Pro handles a real warranty request</p>

          <div className="mt-10 space-y-4">
            {/* Homeowner submits */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <MessageSquare className="h-4 w-4" />
                Homeowner submits
              </div>
              <p className="mt-2 text-base text-gray-800 italic">
                &ldquo;The outlet by the kitchen sink stopped working.&rdquo;
              </p>
            </div>

            {/* AI asks */}
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 uppercase tracking-wide">
                <Bot className="h-4 w-4" />
                AI asks
              </div>
              <p className="mt-2 text-base text-gray-800 italic">
                &ldquo;Have you checked the GFCI outlet nearby and pressed reset?&rdquo;
              </p>
            </div>

            {/* Two outcomes */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700 uppercase tracking-wide">
                  <CheckCircle className="h-4 w-4" />
                  If fixed
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  The issue is documented and closed without bothering the builder or electrician.
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 uppercase tracking-wide">
                  <ClipboardList className="h-4 w-4" />
                  If not fixed
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  After Closing Pro creates an electrical ticket with photos, homeowner answers,
                  urgency, address, and trade recommendation.
                </p>
              </div>
            </div>

            {/* Builder sees */}
            <div className="rounded-xl border-2 border-gray-300 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <Ticket className="h-4 w-4" />
                Builder sees
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Electrical issue', 'Low urgency', 'GFCI attempted', 'Photos attached', 'Ready to assign'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Built for Builders</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Bot,
                title: 'AI Issue Triage',
                desc: 'AI asks the right questions, classifies issues, and resolves simple problems before they become service calls.',
              },
              {
                icon: Ticket,
                title: 'Smart Ticket Management',
                desc: 'Every issue is tracked from submission to sign-off. No more sticky notes, texts, or "I forgot about that."',
              },
              {
                icon: Wrench,
                title: 'Trade Routing',
                desc: 'AI recommends the right trade. Assign in one click. Trades get email notifications with all the details.',
              },
              {
                icon: Shield,
                title: 'Warranty Protection',
                desc: 'Every message, photo, and decision is documented. Full audit trail for warranty disputes.',
              },
              {
                icon: Zap,
                title: 'Instant Escalation',
                desc: 'Emergency issues are flagged immediately. Gas leaks, water damage, electrical issues — you know instantly.',
              },
              {
                icon: CheckCircle,
                title: 'Homeowner Sign-Off',
                desc: 'Homeowners confirm when issues are resolved. Clean records that protect you.',
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                <feature.icon className="h-6 w-6 text-blue-600" />
                <h3 className="mt-3 text-base font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Simple Pricing</h2>
          <p className="mt-2 text-center text-gray-600">Simple plans that grow with you. 30-day money-back guarantee.</p>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl border p-6 ${
                  key === 'growth'
                    ? 'border-blue-200 bg-blue-50 ring-2 ring-blue-600'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {key === 'growth' && (
                  <span className="mb-3 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                    key === 'growth'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">
            Give homeowners a better warranty process without becoming their 24/7 help desk.
          </h2>
          <p className="mt-4 text-gray-400">
            After Closing Pro helps builders collect better information, prevent unnecessary
            service calls, organize real warranty issues, and protect themselves with clean documentation.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#example"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              See Example Ticket
            </Link>
          </div>
        </div>
      </section>

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
