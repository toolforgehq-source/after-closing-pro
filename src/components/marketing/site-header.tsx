import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/compare', label: 'Compare' },
  { href: '/faq', label: 'FAQ' },
];

export function SiteHeader() {
  return (
    <nav className="border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:inline-block"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:px-4"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:px-4"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
