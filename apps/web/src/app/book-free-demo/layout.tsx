import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Book a Free 1-on-1 Growth Demo | GrowLokal',
  description:
    'Schedule a free 1-on-1 live walkthrough of GrowLokal AI. Learn how our autonomous Google Business Profile optimization and vernacular WhatsApp AI chatbot drive 3x more customer calls for local South Indian businesses.',
  alternates: {
    canonical: 'https://growlokal.com/book-free-demo',
  },
  openGraph: {
    title: 'Book a Free 1-on-1 Growth Demo | GrowLokal Technologies',
    description:
      'Schedule a personalized growth walkthrough for your clinic, salon, gym, restaurant, or business. 100% free with no credit card required.',
    url: 'https://growlokal.com/book-free-demo',
    type: 'website',
  },
};

export default function BookFreeDemoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
