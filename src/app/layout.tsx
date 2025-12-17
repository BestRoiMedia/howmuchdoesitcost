import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'How Much Does It Really Cost?',
    template: '%s | How Much Does It Really Cost?',
  },
  description:
    'Neutral, factual cost explainers for home services, business expenses, and major purchases. No ads, no selling—just real numbers.',
  metadataBase: new URL('https://howmuchdoesitreallycost.com'),
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico', sizes: 'any' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon_io/apple-touch-icon.png',
  },
  manifest: '/favicon_io/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
            >
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent sm:text-3xl">
                How Much Does It Really Cost?
              </span>
              <span className="text-xl opacity-80 transition-transform group-hover:translate-x-0.5 sm:text-2xl">
                💸
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} How Much Does It Really Cost?
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Educational content only. Always get multiple quotes for your specific situation.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Built by{' '}
              <a
                href="https://bestroi.media"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Best ROI Media
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
