import { MetadataRoute } from 'next';
import { CITY_DATA } from '@/lib/cityData';
import { VERTICAL_DATA } from '@/lib/verticalData';
import { ARTICLES_DATA } from '@/lib/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://growlokal.com';
  const currentDate = new Date();

  // 1. Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/free-gbp-report`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/book-free-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tools/google-score-calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/revenue-roi-calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resources/whatsapp-kit`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Dynamic Industry Pages (/industry/[slug])
  const industryRoutes: MetadataRoute.Sitemap = Object.keys(VERTICAL_DATA).map((slug) => ({
    url: `${baseUrl}/industry/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Dynamic City Pages (/city/[cityName])
  const cityRoutes: MetadataRoute.Sitemap = Object.keys(CITY_DATA).map((cityKey) => ({
    url: `${baseUrl}/city/${cityKey}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 4. Dynamic Programmatic City x Vertical Pages (/city/[cityName]/[vertical])
  const programmaticRoutes: MetadataRoute.Sitemap = [];
  for (const cityKey of Object.keys(CITY_DATA)) {
    for (const verticalSlug of Object.keys(VERTICAL_DATA)) {
      programmaticRoutes.push({
        url: `${baseUrl}/city/${cityKey}/${verticalSlug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 5. Dynamic Blog Articles (/blog/[slug])
  const blogRoutes: MetadataRoute.Sitemap = Object.keys(ARTICLES_DATA).map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...industryRoutes,
    ...cityRoutes,
    ...programmaticRoutes,
    ...blogRoutes,
  ];
}
