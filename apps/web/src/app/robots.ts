import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growlokal.com';

  const disallowList = [
    '/admin',
    '/admin/',
    '/admin/*',
    '/admin/index.html',
    '/dashboard',
    '/dashboard/',
    '/dashboard/*',
    '/onboarding',
    '/onboarding/',
    '/onboarding/*',
    '/c/',
    '/c/*',
    '/api/',
    '/api/*',
    '/_next/',
    '/static/',
    '/content/',
    '/tina/',
  ];

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
        disallow: disallowList,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: disallowList,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
