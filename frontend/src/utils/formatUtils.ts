/**
 * Format a numeric amount into a readable string with K/M/B suffix
 * @param amount - The amount to format
 * @returns Formatted string (e.g., $20M, $2.5K, $1.2B)
 */
export const formatAmount = (amount: number): string => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

/**
 * Get the CSS classes for styling funding round badges with modern colors
 * @param round - The funding round type
 * @returns CSS classes as a string
 */
export const getRoundColor = (round: string): string => {
  const colors = {
    'Pre-Seed': 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    'Seed': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'Series A': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Series B': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Series C': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'Series D': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'Series E': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'Growth': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    'Late Stage': 'bg-red-500/20 text-red-300 border-red-500/40',
    'IPO': 'bg-gold-500/20 text-yellow-300 border-yellow-500/40',
    'Acquisition': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'Post-IPO Debt': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    'Venture': 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  };
  return colors[round] || 'bg-gray-500/20 text-gray-300 border-gray-500/40';
};