import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = 'https://www.afterclosingpro.com';

export const metadata: Metadata = {
  title: {
    default: 'After Closing Pro - AI Warranty Management for Homebuilders',
    template: '%s | After Closing Pro',
  },
  description:
    'Stop being the warranty department after closing. AI-powered warranty management that helps homebuilders collect, triage, and resolve post-closing issues — replacing texts, calls, and scattered messages with clean, documented tickets.',
  keywords: [
    'warranty management',
    'homebuilder software',
    'post-closing warranty',
    'construction warranty',
    'builder warranty tool',
    'AI triage',
    'trade management',
    'homeowner warranty portal',
  ],
  authors: [{ name: 'After Closing Pro' }],
  creator: 'After Closing Pro',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'After Closing Pro',
    title: 'After Closing Pro - AI Warranty Management for Homebuilders',
    description:
      'Stop being the warranty department after closing. AI-powered warranty management for homebuilders — triage issues, assign trades, document everything.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'After Closing Pro - AI Warranty Management for Homebuilders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'After Closing Pro - AI Warranty Management for Homebuilders',
    description:
      'Stop being the warranty department after closing. AI-powered warranty management for homebuilders.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'After Closing Pro',
    url: siteUrl,
    logo: `${siteUrl}/apple-touch-icon.png`,
    description:
      'AI-powered warranty management software for homebuilders — triage post-closing issues, guide warranty coverage, assign trades, and schedule repairs, all documented.',
  };

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('consent', 'default', {
                  analytics_storage: 'granted'
                });
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
