/**
 * Calculate percentage
 */
export function calcPercentage(current, total) {
  if (!total) return 0;
  return Math.round((current / total) * 100);
}
