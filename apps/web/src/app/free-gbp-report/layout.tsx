import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Google Business Profile Audit & Rank Report | GrowLokal',
  description:
    'Run a free 30-second Google Business Profile audit for your local clinic, salon, gym, restaurant, or store. Compare your visibility score against top local competitors and receive actionable ranking fixes via WhatsApp.',
  alternates: {
    canonical: 'https://growlokal.com/free-gbp-report',
  },
  openGraph: {
    title: 'Free Google Business Profile Audit | GrowLokal Technologies',
    description:
      'Discover why competing local businesses rank higher on Google Maps in your area. Get your free 30-second audit report on WhatsApp.',
    url: 'https://growlokal.com/free-gbp-report',
    type: 'website',
  },
};

export default function FreeGbpReportLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
