'use client'

import { useCallback, useEffect, useState } from 'react'

import type { Account } from '@/lib/data'
import {
  emptyTargetNames,
  hasCustomTargetNames,
  importTargetConfig,
  loadAccountsCache,
  loadTargetNames,
  saveAccountsCache,
  saveTargetNames,
  SCORING_VERSION,
  type TargetConfigExport,
  updateCachedAccount,
} from '@/lib/target-accounts-storage'
import { calibrateAccountPortfolio } from '@/lib/tier-calibration'

function getInitialAccounts(): Account[] {
  if (typeof window === 'undefined') return []
  const cache = loadAccountsCache()
  if (!cache?.accounts?.length) return []
  return cache.scoringVersion === SCORING_VERSION
    ? cache.accounts
    : calibrateAccountPortfolio(cache.accounts)
}

interface RefreshResponse {
  accounts: Account[]
  refreshedAt: string
  source: string
  message?: string
  error?: string
}

export function useTargetAccounts() {
  const [hydrated, setHydrated] = useState(false)
  const [targetNames, setTargetNames] = useState<string[]>(() =>
    typeof window !== 'undefined' ? loadTargetNames() : emptyTargetNames()
  )
  const [accounts, setAccounts] = useState<Account[]>(() => getInitialAccounts())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [replacingStakeholderKey, setReplacingStakeholderKey] = useState<string | null>(null)
  const [refreshingPovAccountId, setRefreshingPovAccountId] = useState<string | null>(null)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null)
  const [refreshSource, setRefreshSource] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const names = loadTargetNames()
    const cache = loadAccountsCache()

    setTargetNames(names)
    if (cache?.accounts?.length) {
      const accounts =
        cache.scoringVersion === SCORING_VERSION
          ? cache.accounts
          : calibrateAccountPortfolio(cache.accounts)

      setAccounts(accounts)

      if (cache.scoringVersion !== SCORING_VERSION) {
        saveAccountsCache({
          accounts,
          refreshedAt: cache.refreshedAt,
          source: cache.source,
          scoringVersion: SCORING_VERSION,
        })
      }
      setLastRefreshedAt(cache.refreshedAt)
      setRefreshSource(cache.source ?? null)
    }
    setHydrated(true)
  }, [])

  const persistAccounts = useCallback(
    (nextAccounts: Account[]) => {
      saveAccountsCache({
        accounts: nextAccounts,
        refreshedAt: lastRefreshedAt,
        source: refreshSource ?? undefined,
        scoringVersion: SCORING_VERSION,
      })
    },
    [lastRefreshedAt, refreshSource]
  )

  const updateAccount = useCallback(
    (accountId: string, updater: (account: Account) => Account) => {
      setAccounts((prev) => {
        const next = prev.map((a) => (a.id === accountId ? updater(a) : a))
        persistAccounts(next)
        return next
      })
    },
    [persistAccounts]
  )

  const updateTargetName = useCallback((index: number, value: string) => {
    setTargetNames((prev) => {
      const next = [...prev]
      next[index] = value
      saveTargetNames(next)
      return next
    })
  }, [])

  const swapTargetNames = useCallback((indexA: number, indexB: number) => {
    setTargetNames((prev) => {
      const next = [...prev]
      ;[next[indexA], next[indexB]] = [next[indexB], next[indexA]]
      saveTargetNames(next)
      return next
    })
  }, [])

  const importTargets = useCallback((config: TargetConfigExport) => {
    importTargetConfig(config)
    const names = loadTargetNames()
    const cache = loadAccountsCache()
    setTargetNames(names)
    if (cache?.accounts?.length) {
      const nextAccounts =
        cache.scoringVersion === SCORING_VERSION
          ? cache.accounts
          : calibrateAccountPortfolio(cache.accounts)
      setAccounts(nextAccounts)
      setLastRefreshedAt(cache.refreshedAt)
      setRefreshSource(cache.source ?? null)
    } else {
      setAccounts([])
      setLastRefreshedAt(null)
      setRefreshSource(null)
    }
    setStatusMessage('Imported target accounts from backup.')
    setError(null)
  }, [])

  const refreshAccounts = useCallback(async () => {
    if (!hasCustomTargetNames(targetNames)) {
      setError('Add at least one target company name before refreshing.')
      return
    }

    setIsRefreshing(true)
    setError(null)
    setStatusMessage(null)

    try {
      const response = await fetch('/api/accounts/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: targetNames }),
      })

      const data = (await response.json()) as RefreshResponse

      if (!response.ok) {
        throw new Error(data.error ?? 'Refresh failed')
      }

      setAccounts(data.accounts)
      setLastRefreshedAt(data.refreshedAt)
      setRefreshSource(data.source)
      setStatusMessage(data.message ?? null)
      saveTargetNames(targetNames)
      saveAccountsCache({
        accounts: data.accounts,
        refreshedAt: data.refreshedAt,
        source: data.source,
        scoringVersion: SCORING_VERSION,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Refresh failed'
      setError(message)
    } finally {
      setIsRefreshing(false)
    }
  }, [targetNames])

  const replaceStakeholderTarget = useCallback(
    async (accountId: string, stakeholderIndex: number) => {
      const account = accounts.find((a) => a.id === accountId)
      if (!account) return

      const key = `${accountId}-${stakeholderIndex}`
      setReplacingStakeholderKey(key)
      setError(null)

      try {
        const existingStakeholders = account.details.stakeholderTargets.filter(
          (_, i) => i !== stakeholderIndex
        )

        const response = await fetch('/api/accounts/stakeholder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountName: account.name,
            industry: account.industry,
            website: account.details.website,
            existingStakeholders,
            excludeNames: account.details.stakeholderTargets.map((s) => s.name),
          }),
        })

        const data = (await response.json()) as {
          stakeholder?: Account['details']['stakeholderTargets'][0]
          error?: string
        }

        if (!response.ok || !data.stakeholder) {
          throw new Error(data.error ?? 'Failed to replace stakeholder')
        }

        const updated: Account = {
          ...account,
          details: {
            ...account.details,
            stakeholderTargets: account.details.stakeholderTargets.map((s, i) =>
              i === stakeholderIndex ? data.stakeholder! : s
            ),
          },
        }

        updateAccount(accountId, () => updated)
        updateCachedAccount(updated)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stakeholder replace failed'
        setError(message)
      } finally {
        setReplacingStakeholderKey(null)
      }
    },
    [accounts, updateAccount]
  )

  const refreshAccountPov = useCallback(
    async (accountId: string) => {
      const account = accounts.find((a) => a.id === accountId)
      if (!account) return

      setRefreshingPovAccountId(accountId)
      setError(null)

      try {
        const response = await fetch('/api/accounts/pov', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account: {
              name: account.name,
              industry: account.industry,
              website: account.details.website,
              employees: account.details.employees,
              funding: account.details.funding,
              techStack: account.details.techStack,
              recentNews: account.details.recentNews,
              battleNotes: account.details.battleNotes,
              tier: account.tier,
            },
          }),
        })

        const data = (await response.json()) as {
          pov?: Account['details']['pov']
          error?: string
        }

        if (!response.ok || !data.pov) {
          throw new Error(data.error ?? 'Failed to refresh POV')
        }

        const updated: Account = {
          ...account,
          details: {
            ...account.details,
            pov: data.pov,
          },
        }

        updateAccount(accountId, () => updated)
        updateCachedAccount(updated)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'POV refresh failed'
        setError(message)
      } finally {
        setRefreshingPovAccountId(null)
      }
    },
    [accounts, updateAccount]
  )

  return {
    hydrated,
    targetNames,
    accounts,
    isRefreshing,
    replacingStakeholderKey,
    refreshingPovAccountId,
    lastRefreshedAt,
    refreshSource,
    statusMessage,
    error,
    updateTargetName,
    swapTargetNames,
    importTargets,
    refreshAccounts,
    updateAccount,
    replaceStakeholderTarget,
    refreshAccountPov,
  }
}
