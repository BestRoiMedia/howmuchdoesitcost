import 'server-only';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { CostEntry } from './types';

export type { CostEntry };

export function getAllCosts(): CostEntry[] {
  const filePath = join(process.cwd(), 'content', 'costs.json');
  const fileContents = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getCostBySlug(slug: string): CostEntry | undefined {
  const costs = getAllCosts();
  return costs.find((cost) => cost.slug === slug);
}

export function getAllSlugs(): string[] {
  const costs = getAllCosts();
  return costs.map((cost) => cost.slug);
}

export function getCostsByCategory(): Record<string, CostEntry[]> {
  const costs = getAllCosts();
  return costs.reduce(
    (acc, cost) => {
      if (!acc[cost.category]) {
        acc[cost.category] = [];
      }
      acc[cost.category].push(cost);
      return acc;
    },
    {} as Record<string, CostEntry[]>
  );
}

export function getCategories(): string[] {
  const costs = getAllCosts();
  const categories = [...new Set(costs.map((cost) => cost.category))];
  return categories;
}
