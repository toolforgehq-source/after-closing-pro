import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Bot,
  Ticket,
  Home,
  Wrench,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageSquare,
  FileText,
  Clock,
  Zap,
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
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Start Free Trial
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
          <div className="absolute inset-0 bg-gray-900/60" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Stop warranty calls from{' '}
            <span className="text-blue-400">eating your life</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            After Closing Pro uses AI to handle homeowner warranty requests after closing.
            It collects the right info, solves simple issues before they become service calls,
            routes real issues to the right trade, and documents everything.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700"
            >
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-300">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Sound Familiar?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Phone, text: 'Homeowners calling you at 9pm about a tripped breaker' },
              { icon: MessageSquare, text: 'Endless texts about issues that are just maintenance' },
              { icon: Clock, text: 'Hours spent coordinating trades for simple fixes' },
              { icon: FileText, text: 'No documentation when warranty disputes happen' },
              { icon: Wrench, text: 'Sending trades for unnecessary service calls' },
              { icon: Home, text: 'Managing warranty across dozens of homes in your head' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                <item.icon className="h-5 w-5 text-red-400" />
                <p className="mt-3 text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
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

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
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
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Simple Pricing</h2>
          <p className="mt-2 text-center text-gray-600">Start free. Upgrade when you&apos;re ready.</p>

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
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-900 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to stop chasing warranty calls?</h2>
          <p className="mt-3 text-gray-400">
            Join builders who are saving hours every week with AI-powered warranty management.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700"
          >
            Start Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">After Closing Pro</span>
          </div>
          <p className="text-sm text-gray-400">
            Built by builders, for builders.
          </p>
        </div>
      </footer>
    </div>
  );
}
