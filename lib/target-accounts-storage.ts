import type { Account } from '@/lib/data'
import {
  LEGACY_DEMO_TARGET_NAMES,
  TARGET_ACCOUNT_SLOTS,
} from '@/lib/refresh-accounts'

const NAMES_KEY = 'si-target-account-names'
const CACHE_KEY = 'si-accounts-cache'
export const SCORING_VERSION = 3

export interface AccountsCache {
  accounts: Account[]
  refreshedAt: string | null
  source?: string
  scoringVersion?: number
}

export interface TargetConfigExport {
  version: 1
  exportedAt: string
  targetNames: string[]
  accountsCache?: AccountsCache
}

export function emptyTargetNames(): string[] {
  return Array(TARGET_ACCOUNT_SLOTS).fill('')
}

export function normalizeTargetNames(parsed: string[]): string[] {
  const padded = [...parsed]
  while (padded.length < TARGET_ACCOUNT_SLOTS) padded.push('')
  return padded.slice(0, TARGET_ACCOUNT_SLOTS)
}

export function isLegacyDemoTargetNames(names: string[]): boolean {
  return LEGACY_DEMO_TARGET_NAMES.every(
    (legacy, index) => (names[index] ?? '').trim() === legacy
  )
}

export function hasCustomTargetNames(names: string[]): boolean {
  return names.some((name) => name.trim().length > 0)
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
  if (typeof window === 'undefined') return emptyTargetNames()

  try {
    const raw = localStorage.getItem(NAMES_KEY)
    if (!raw) return emptyTargetNames()
    const parsed = JSON.parse(raw) as string[]
    if (!Array.isArray(parsed)) return emptyTargetNames()

    const normalized = normalizeTargetNames(parsed)
    if (isLegacyDemoTargetNames(normalized)) {
      saveTargetNames(emptyTargetNames())
      localStorage.removeItem(CACHE_KEY)
      return emptyTargetNames()
    }
    return normalized
  } catch {
    return emptyTargetNames()
  }
}

export function saveTargetNames(names: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(NAMES_KEY, JSON.stringify(normalizeTargetNames(names)))
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

export function buildTargetConfigExport(): TargetConfigExport {
  const cache = loadAccountsCache()
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    targetNames: loadTargetNames(),
    accountsCache: cache ?? undefined,
  }
}

export function importTargetConfig(data: TargetConfigExport): void {
  if (data.version !== 1 || !Array.isArray(data.targetNames)) {
    throw new Error('Invalid target config file')
  }

  saveTargetNames(data.targetNames)
  if (data.accountsCache?.accounts?.length) {
    saveAccountsCache({
      ...data.accountsCache,
      accounts: data.accountsCache.accounts.map((a) =>
        migrateAccount(a as unknown as Record<string, unknown>)
      ),
      scoringVersion: data.accountsCache.scoringVersion ?? SCORING_VERSION,
    })
  }
}
