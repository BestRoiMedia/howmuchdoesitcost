/**
 * Format a number as USD currency with no cents
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a cost range with optional unit
 */
export function formatRange(min: number, max: number, unit?: string): string {
  const range = `${formatUSD(min)} to ${formatUSD(max)}`;
  return unit ? `${range} ${unit}` : range;
}
