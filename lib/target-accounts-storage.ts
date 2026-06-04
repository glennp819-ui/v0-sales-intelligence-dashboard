import type { Account } from '@/lib/data'
import { DEFAULT_TARGET_NAMES, TARGET_ACCOUNT_SLOTS } from '@/lib/refresh-accounts'

const NAMES_KEY = 'si-target-account-names'
const CACHE_KEY = 'si-accounts-cache'

export interface AccountsCache {
  accounts: Account[]
  refreshedAt: string | null
  source?: string
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
    return JSON.parse(raw) as AccountsCache
  } catch {
    return null
  }
}

export function saveAccountsCache(cache: AccountsCache): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}
