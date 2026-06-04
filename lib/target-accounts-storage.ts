import type { Account } from '@/lib/data'
import { DEFAULT_TARGET_NAMES, TARGET_ACCOUNT_SLOTS } from '@/lib/refresh-accounts'

const NAMES_KEY = 'si-target-account-names'
const CACHE_KEY = 'si-accounts-cache'
export const SCORING_VERSION = 2

export interface AccountsCache {
  accounts: Account[]
  refreshedAt: string | null
  source?: string
  scoringVersion?: number
}

/** Migrate legacy cached accounts (champions → stakeholderTargets, add pov). */
export function migrateAccount(raw: Record<string, unknown>): Account {
  const account = raw as Account & {
    details?: Account['details'] & {
      champions?: Account['details']['stakeholderTargets']
    }
  }

  const details = account.details ?? ({} as Account['details'])
  const legacyChampions = (details as { champions?: Account['details']['stakeholderTargets'] })
    .champions

  let stakeholderTargets = details.stakeholderTargets ?? legacyChampions ?? []
  while (stakeholderTargets.length < 5) {
    stakeholderTargets = [
      ...stakeholderTargets,
      {
        name: `Stakeholder ${stakeholderTargets.length + 1}`,
        title: 'Engineering Leader (placeholder)',
        linkedIn: 'linkedin.com',
      },
    ]
  }
  stakeholderTargets = stakeholderTargets.slice(0, 5)

  const pov = details.pov ?? {
    whyAnything: `Engineering velocity and AI tooling are strategic priorities for ${account.name}.`,
    whyNow: 'Recent funding, product launches, or hiring signals create a window to engage.',
    whyCursor:
      'Cursor offers an AI-native IDE with codebase-wide context — a step change from autocomplete-only tools.',
  }

  return {
    ...account,
    details: {
      ...details,
      stakeholderTargets,
      pov,
    },
  }
}

export function loadTargetNames(): string[] {
  if (typeof window === 'undefined') return [...DEFAULT_TARGET_NAMES]

  try {
    const raw = localStorage.getItem(NAMES_KEY)
    if (!raw) return [...DEFAULT_TARGET_NAMES]
    const parsed = JSON.parse(raw) as string[]
    if (!Array.isArray(parsed)) return [...DEFAULT_TARGET_NAMES]

    const padded = [...parsed]
    while (padded.length < TARGET_ACCOUNT_SLOTS) padded.push('')
    return padded.slice(0, TARGET_ACCOUNT_SLOTS)
  } catch {
    return [...DEFAULT_TARGET_NAMES]
  }
}

export function saveTargetNames(names: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(NAMES_KEY, JSON.stringify(names.slice(0, TARGET_ACCOUNT_SLOTS)))
}

export function loadAccountsCache(): AccountsCache | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AccountsCache
    return {
      ...parsed,
      accounts: parsed.accounts.map((a) => migrateAccount(a as unknown as Record<string, unknown>)),
    }
  } catch {
    return null
  }
}

export function saveAccountsCache(cache: AccountsCache): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

export function updateCachedAccount(account: Account): void {
  const cache = loadAccountsCache()
  if (!cache) return

  saveAccountsCache({
    ...cache,
    accounts: cache.accounts.map((a) => (a.id === account.id ? account : a)),
  })
}
