import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ECSG1 - Premium Cleaning Services',
    template: '%s | ECSG1',
  },
  description: 'Enterprise-grade cleaning services platform with AI-powered booking, gamification, and transparent pricing.',
  keywords: ['cleaning services', 'booking', 'professional cleaning', 'home cleaning', 'office cleaning'],
  authors: [{ name: 'ECSG1 Team' }],
  creator: 'ECSG1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ecsg1.com',
    title: 'ECSG1 - Premium Cleaning Services',
    description: 'Enterprise-grade cleaning services platform',
    siteName: 'ECSG1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
