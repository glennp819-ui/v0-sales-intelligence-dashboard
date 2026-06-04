/** Score bar / text colors: green = strong, amber = mid, red = weak */
export function scoreBarColor(value: number): string {
  if (value >= 75) return 'bg-[#10B981]'
  if (value >= 50) return 'bg-[#F59E0B]'
  return 'bg-[#EF4444]'
}

export function scoreTextColor(value: number): string {
  if (value >= 75) return 'text-[#10B981]'
  if (value >= 50) return 'text-[#F59E0B]'
  return 'text-[#EF4444]'
}

export function scoreTierLabel(value: number): 'High' | 'Mid' | 'Low' {
  if (value >= 75) return 'High'
  if (value >= 50) return 'Mid'
  return 'Low'
}
