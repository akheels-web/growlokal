import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Business Owner Sign In | GrowLokal AI Dashboard',
  description:
    'Sign in to your GrowLokal AI business portal. Monitor Google Maps rankings, approve AI review replies, and broadcast WhatsApp offers to local customers.',
  alternates: {
    canonical: 'https://growlokal.com/login',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
