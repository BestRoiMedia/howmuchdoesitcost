import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/costs';

const BASE_URL = 'https://howmuchdoesitreallycost.com';

// Use a date string in W3C Datetime format (YYYY-MM-DD) for better compatibility
function getLastModDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = getLastModDate();
  const slugs = getAllSlugs();
  const costPages = slugs.map((slug) => ({
    url: `${BASE_URL}/how-much-does-${slug}-really-cost`,
    lastModified: lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...costPages,
  ];
}

