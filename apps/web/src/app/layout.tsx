import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://growlokal.com'),
  title: {
    default: 'GrowLokal — Autonomous AI Marketing Platform for South Indian Local Businesses',
    template: '%s | GrowLokal Technologies',
  },
  description:
    'Get a free instant Google Business Profile report for your local clinic, salon, store, restaurant, or business. AI-driven local marketing, WhatsApp auto-replies, Google post automation, and broadcast campaigns in Telugu, Tamil, Kannada & English.',
  keywords: [
    'local business marketing app',
    'Google Business Profile audit for local stores',
    'WhatsApp marketing automation South India',
    'AI marketing tool for Hyderabad local businesses',
    'clinic salon store growth tool',
    'vernacular marketing Telugu Tamil Kannada',
    'GrowLokal Technologies',
  ],
  authors: [{ name: 'GrowLokal Technologies', url: 'https://growlokal.com' }],
  creator: 'GrowLokal Technologies',
  publisher: 'GrowLokal Technologies',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'GrowLokal — Autonomous AI Marketing for South Indian Local Businesses',
    description:
      'Is your local business invisible on Google? Get a free 30-second audit report and automate your WhatsApp customer enquiries & Google posts in Telugu, Tamil, and English.',
    type: 'website',
    url: 'https://growlokal.com',
    siteName: 'GrowLokal',
    locale: 'en_IN',
    images: [
      {
        url: 'https://growlokal.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GrowLokal AI Marketing Platform for South Indian Local Businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrowLokal — AI Marketing for South Indian Local Businesses',
    description: 'Automate Google posts, WhatsApp customer enquiries & campaigns for your business.',
    images: ['https://growlokal.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://growlokal.com',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://growlokal.com/#organization',
        name: 'GrowLokal Technologies',
        url: 'https://growlokal.com',
        logo: 'https://growlokal.com/logo.png',
        sameAs: ['https://wa.me/919876543210'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-9876543210',
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['en', 'te', 'ta', 'kn'],
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://growlokal.com/#software',
        name: 'GrowLokal AI Marketing Platform',
        operatingSystem: 'Web, WhatsApp, Android, iOS',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '2999',
          priceCurrency: 'INR',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
        },
        description:
          'Autonomous AI local marketing software for clinics, salons, stores, restaurants, and local businesses in South India.',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#033540" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
