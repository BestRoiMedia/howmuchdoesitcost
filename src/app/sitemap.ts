import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/costs';

const BASE_URL = 'https://howmuchdoesitreallycost.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const costPages = slugs.map((slug) => ({
    url: `${BASE_URL}/how-much-does-${slug}-really-cost`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...costPages,
  ];
}

