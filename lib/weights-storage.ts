import { defaultWeights, type CriteriaWeight } from '@/lib/data'

const WEIGHTS_KEY = 'si-criteria-weights'

export function loadWeights(): CriteriaWeight[] {
  if (typeof window === 'undefined') return defaultWeights

  try {
    const raw = localStorage.getItem(WEIGHTS_KEY)
    if (!raw) return defaultWeights
    const parsed = JSON.parse(raw) as CriteriaWeight[]
    if (!Array.isArray(parsed) || parsed.length !== defaultWeights.length) {
      return defaultWeights
    }
    const total = parsed.reduce((sum, w) => sum + w.weight, 0)
    return total === 100 ? parsed : defaultWeights
  } catch {
    return defaultWeights
  }
}

export function saveWeights(weights: CriteriaWeight[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights))
}
