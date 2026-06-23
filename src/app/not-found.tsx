import Link from 'next/link';
import { Shield, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="text-center">
        <Shield className="mx-auto h-12 w-12 text-blue-600" />
        <h1 className="mt-4 text-6xl font-extrabold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <p className="mt-1 text-sm text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
