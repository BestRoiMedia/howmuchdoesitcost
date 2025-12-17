export interface CostEntry {
  slug: string;
  topic: string;
  title: string;
  minCost: number;
  maxCost: number;
  unit?: string;
  category: string;
}
