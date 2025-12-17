'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CostEntry } from '@/lib/types';
import { formatUSD } from '@/lib/format';

interface HomeContentProps {
  costs: CostEntry[];
}

// Hardcoded popular items by slug
const POPULAR_SLUGS = [
  'a-bathroom-remodel',
  'a-kitchen-remodel',
  'a-wedding',
  'a-roof-replacement',
  'a-small-business-website',
  'invisalign',
];

// Category order for display
const CATEGORY_ORDER = [
  'Home Improvement',
  'Home Systems',
  'Home Services',
  'Outdoor & Property',
  'Electronics',
  'Digital & Marketing',
  'Legal & Business',
  'Finance & Insurance',
  'Health & Wellness',
  'Life Events',
  'Real Estate',
  'Travel & Leisure',
  'Vehicles',
  'Education',
  'Pet Services',
  'Transportation',
  'Utilities',
];

function CostCard({ cost }: { cost: CostEntry }) {
  const range = cost.unit
    ? `${formatUSD(cost.minCost)}–${formatUSD(cost.maxCost)} ${cost.unit}`
    : `${formatUSD(cost.minCost)}–${formatUSD(cost.maxCost)}`;

  return (
    <Link
      href={`/how-much-does-${cost.slug}-really-cost`}
      className="group block rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
        {cost.topic.charAt(0).toUpperCase() + cost.topic.slice(1)}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{range}</p>
    </Link>
  );
}

export default function HomeContent({ costs }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter costs based on search query
  const filteredCosts = useMemo(() => {
    if (!searchQuery.trim()) return costs;
    const query = searchQuery.toLowerCase();
    return costs.filter(
      (cost) =>
        cost.topic.toLowerCase().includes(query) ||
        cost.title.toLowerCase().includes(query) ||
        cost.category.toLowerCase().includes(query)
    );
  }, [costs, searchQuery]);

  // Get popular items
  const popularItems = useMemo(() => {
    return POPULAR_SLUGS.map((slug) => costs.find((c) => c.slug === slug)).filter(
      (c): c is CostEntry => c !== undefined
    );
  }, [costs]);

  // Group filtered costs by category
  const costsByCategory = useMemo(() => {
    const grouped: Record<string, CostEntry[]> = {};
    for (const cost of filteredCosts) {
      if (!grouped[cost.category]) {
        grouped[cost.category] = [];
      }
      grouped[cost.category].push(cost);
    }
    return grouped;
  }, [filteredCosts]);

  // Get ordered categories that have items
  const orderedCategories = useMemo(() => {
    return CATEGORY_ORDER.filter((cat) => costsByCategory[cat]?.length > 0);
  }, [costsByCategory]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero section */}
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
          Real costs, no sales pitch
        </h1>
        <p className="mt-1 text-base text-gray-500">
          Neutral, factual cost explainers for home projects, business expenses,
          and major purchases.
        </p>
      </div>

      {/* Search input */}
      <div className="mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a cost guide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pl-11 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {isSearching && (
          <p className="mt-2 text-sm text-gray-500">
            {filteredCosts.length} result{filteredCosts.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Popular section - only show when not searching */}
      {!isSearching && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Popular right now
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularItems.map((cost) => (
              <CostCard key={cost.slug} cost={cost} />
            ))}
          </div>
        </section>
      )}

      {/* No results message */}
      {filteredCosts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No cost guides found matching your search.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-sm text-gray-700 underline hover:text-gray-900"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Category sections */}
      {orderedCategories.map((category) => (
        <section key={category} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {costsByCategory[category].map((cost) => (
              <CostCard key={cost.slug} cost={cost} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
