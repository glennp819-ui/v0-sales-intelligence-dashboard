import {
  calculateTotalScore,
  defaultWeights,
  type Account,
  type CriteriaWeight,
} from '@/lib/data'

/** ~12.5% reduction — cautious AE scoring lens */
export const SCORE_SKEPTICISM_FACTOR = 0.875

const MAX_STRIKE_NOW = 3
const MIN_BUILD_WARM = 1
const MIN_MONITOR = 1

type Tier = 1 | 2 | 3

export function calibrateScoreValue(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * SCORE_SKEPTICISM_FACTOR)))
}

export function calibrateScores(scores: Account['scores']): Account['scores'] {
  return {
    engineeringHeadcount: calibrateScoreValue(scores.engineeringHeadcount),
    aiMlInvestment: calibrateScoreValue(scores.aiMlInvestment),
    toolingStack: calibrateScoreValue(scores.toolingStack),
    fundingRecency: calibrateScoreValue(scores.fundingRecency),
    developerVelocity: calibrateScoreValue(scores.developerVelocity),
    championAccessibility: calibrateScoreValue(scores.championAccessibility),
    expansionPotential: calibrateScoreValue(scores.expansionPotential),
  }
}

/** Rank-based tier slots: bottom = monitor, next = warm, top = strike (up to 3). */
function initialTierForRank(rank: number, total: number): Tier {
  if (rank === total - 1) return 3
  if (rank === total - 2) return 2
  if (rank < MAX_STRIKE_NOW) return 1
  return 2
}

function targetStrikeCount(total: number): number {
  if (total <= MIN_MONITOR + MIN_BUILD_WARM) return 0
  return Math.min(MAX_STRIKE_NOW, total - MIN_BUILD_WARM - MIN_MONITOR)
}

function maxWarmCount(total: number): number {
  return Math.max(MIN_BUILD_WARM, total - MAX_STRIKE_NOW - MIN_MONITOR)
}

function countTiers(tiers: Tier[]) {
  return {
    strike: tiers.filter((t) => t === 1).length,
    warm: tiers.filter((t) => t === 2).length,
    monitor: tiers.filter((t) => t === 3).length,
  }
}

/** Enforce portfolio tier mix: ≤3 strike now, ≥1 build & warm, ≥1 monitor */
function enforceTierMix(tiers: Tier[]): Tier[] {
  const next = [...tiers]
  const total = next.length
  let { strike, warm, monitor } = countTiers(next)

  while (strike > MAX_STRIKE_NOW) {
    const idx = next.lastIndexOf(1)
    if (idx === -1) break
    next[idx] = 2
    strike--
    warm++
  }

  while (monitor < MIN_MONITOR) {
    const idx = next.findIndex((t) => t === 2)
    if (idx === -1) break
    next[idx] = 3
    warm--
    monitor++
  }

  while (warm < MIN_BUILD_WARM) {
    const idx = next.findIndex((t) => t === 1)
    if (idx === -1) break
    next[idx] = 2
    strike--
    warm++
  }

  const targetStrike = targetStrikeCount(total)
  while (strike < targetStrike) {
    const idx = next.findIndex((t) => t === 2)
    if (idx === -1) break
    next[idx] = 1
    strike++
    warm--
  }

  const warmCap = maxWarmCount(total)
  while (warm > warmCap) {
    const idx = next.lastIndexOf(2)
    if (idx === -1) break
    next[idx] = 3
    warm--
    monitor++
  }

  return next
}

export function assignPortfolioTiers(
  accounts: Account[],
  weights: CriteriaWeight[] = defaultWeights
): Account[] {
  if (accounts.length === 0) return accounts

  const ranked = accounts
    .map((account) => ({
      account,
      score: calculateTotalScore(account, weights),
    }))
    .sort((a, b) => b.score - a.score)

  const tiers = enforceTierMix(
    ranked.map((_, index) => initialTierForRank(index, ranked.length))
  )

  return ranked.map(({ account }, index) => ({
    ...account,
    tier: tiers[index],
  }))
}

export function calibrateAccount(
  account: Account,
  weights: CriteriaWeight[] = defaultWeights
): Account {
  return {
    ...account,
    scores: calibrateScores(account.scores),
  }
}

export function calibrateAccountPortfolio(
  accounts: Account[],
  weights: CriteriaWeight[] = defaultWeights
): Account[] {
  const calibrated = accounts.map((account) => calibrateAccount(account, weights))
  return assignPortfolioTiers(calibrated, weights)
}

export const TIER_SCORING_GUIDANCE = `
SCORING CALIBRATION (required — skeptical AE lens):
- Apply a cautious 10–15% discount vs optimistic fit; most criteria scores should land 45–72.
- Scores above 78 are rare and need strong evidence (1,000+ engineers, clear AI investment, VS Code footprint).
- tier labels are assigned portfolio-wide after scoring: max 3 "strike now", at least 1 "build & warm", at least 1 "monitor".
- Prefer tier 2 unless multiple high-weight signals are clearly proven in public data.
`.trim()
