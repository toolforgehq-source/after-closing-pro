import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

const footerLinks = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/why', label: 'Why I Built This' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          Built by a builder, for builders.
        </p>
      </div>
    </footer>
  );
}
