import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'After Closing Pro - AI Warranty Management for Homebuilders',
  description:
    'Stop warranty calls from eating your life. AI-powered warranty and homeowner care platform for homebuilders.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
