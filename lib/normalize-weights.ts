import type { CriteriaWeight } from '@/lib/data'

/** Adjust one weight and redistribute the remainder across other criteria to total 100%. */
export function normalizeWeightsOnChange(
  weights: CriteriaWeight[],
  changedId: string,
  newWeight: number
): CriteriaWeight[] {
  const clamped = Math.max(0, Math.min(100, Math.round(newWeight)))
  const others = weights.filter((w) => w.id !== changedId)
  const remaining = 100 - clamped

  if (others.length === 0) {
    return weights.map((w) => (w.id === changedId ? { ...w, weight: 100 } : w))
  }

  const othersTotal = others.reduce((sum, w) => sum + w.weight, 0)
  let assigned = 0

  const redistributed = others.map((w, index) => {
    if (index === others.length - 1) {
      return { ...w, weight: Math.max(0, remaining - assigned) }
    }

    const share =
      othersTotal > 0
        ? Math.round((w.weight / othersTotal) * remaining)
        : Math.round(remaining / others.length)

    assigned += share
    return { ...w, weight: share }
  })

  return weights.map((w) => {
    if (w.id === changedId) return { ...w, weight: clamped }
    return redistributed.find((o) => o.id === w.id) ?? w
  })
}
