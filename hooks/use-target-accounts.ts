'use client'

import { useCallback, useEffect, useState } from 'react'

import { mockAccounts, type Account } from '@/lib/data'
import { TARGET_ACCOUNT_SLOTS } from '@/lib/refresh-accounts'
import {
  loadAccountsCache,
  loadTargetNames,
  saveAccountsCache,
  saveTargetNames,
} from '@/lib/target-accounts-storage'

interface RefreshResponse {
  accounts: Account[]
  refreshedAt: string
  source: string
  message?: string
  error?: string
}

export function useTargetAccounts() {
  const [targetNames, setTargetNames] = useState<string[]>(() =>
    Array(TARGET_ACCOUNT_SLOTS).fill('')
  )
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null)
  const [refreshSource, setRefreshSource] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const names = loadTargetNames()
    const cache = loadAccountsCache()

    setTargetNames(names)
    if (cache?.accounts?.length) {
      setAccounts(cache.accounts)
      setLastRefreshedAt(cache.refreshedAt)
      setRefreshSource(cache.source ?? null)
    }
  }, [])

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

  const refreshAccounts = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

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
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Refresh failed'
      setError(message)
    } finally {
      setIsRefreshing(false)
    }
  }, [targetNames])

  return {
    targetNames,
    accounts,
    isRefreshing,
    lastRefreshedAt,
    refreshSource,
    statusMessage,
    error,
    updateTargetName,
    swapTargetNames,
    refreshAccounts,
  }
}
