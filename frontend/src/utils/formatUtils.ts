
/**
 * Format a numeric amount into a readable string with K/M suffix
 * @param amount - The amount to format
 * @returns Formatted string (e.g., $20M, $2.5K)
 */
export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
};

/**
 * Get the CSS classes for styling funding round badges
 * @param round - The funding round type
 * @returns CSS classes as a string
 */
export const getRoundColor = (round: string): string => {
  const colors = {
    'Pre-Seed': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Seed': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Series A': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Series B': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Series C': 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return colors[round] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};
