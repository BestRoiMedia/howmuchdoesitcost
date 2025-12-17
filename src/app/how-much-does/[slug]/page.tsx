import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CostPageTemplate from '@/components/CostPageTemplate';
import { getCostBySlug, getAllSlugs } from '@/lib/costs';
import { formatRange } from '@/lib/format';

const BASE_URL = 'https://howmuchdoesitreallycost.com';

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCostBySlug(slug);

  if (!entry) {
    return {
      title: 'Not Found',
    };
  }

  const publicUrl = `${BASE_URL}/how-much-does-${slug}-really-cost`;
  const description = `${entry.topic.charAt(0).toUpperCase() + entry.topic.slice(1)} typically costs ${formatRange(entry.minCost, entry.maxCost, entry.unit)}. Get a complete breakdown of what drives the cost and what to expect.`;

  return {
    title: {
      absolute: entry.title,
    },
    description,
    alternates: {
      canonical: publicUrl,
    },
    openGraph: {
      title: entry.title,
      description,
      url: publicUrl,
      type: 'website',
    },
  };
}

export default async function CostPage({ params }: Props) {
  const { slug } = await params;
  const entry = getCostBySlug(slug);

  if (!entry) {
    notFound();
  }

  return <CostPageTemplate entry={entry} />;
}
