import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growlokal.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/free-gbp-report',
          '/book-free-demo',
          '/tools/',
          '/city/',
          '/industry/',
          '/blog/',
          '/resources/',
          '/privacy',
          '/terms',
          '/refund',
          '/login',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/onboarding/',
          '/c/',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/onboarding/', '/c/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/onboarding/', '/c/', '/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/onboarding/', '/c/', '/api/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/onboarding/', '/c/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/onboarding/', '/c/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
