'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeftRight, Loader2, RefreshCw, Settings2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TARGET_ACCOUNT_SLOTS } from '@/lib/refresh-accounts'

interface TargetAccountsPanelProps {
  targetNames: string[]
  isRefreshing: boolean
  lastRefreshedAt: string | null
  refreshSource: string | null
  statusMessage: string | null
  error: string | null
  onNameChange: (index: number, value: string) => void
  onSwap: (indexA: number, indexB: number) => void
  onRefresh: () => void
}

function formatRefreshedAt(iso: string | null): string {
  if (!iso) return 'Not refreshed yet'
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function TargetAccountsPanel({
  targetNames,
  isRefreshing,
  lastRefreshedAt,
  refreshSource,
  statusMessage,
  error,
  onNameChange,
  onSwap,
  onRefresh,
}: TargetAccountsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  const handleRefresh = () => {
    onRefresh()
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((open) => !open)}
        className="gap-1.5"
      >
        <Settings2 className="size-3.5" />
        Target Accounts
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[22rem] rounded-lg border border-border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium text-foreground">5 Target Accounts</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Edit names, swap slots, then refresh for latest intel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-2">
            {Array.from({ length: TARGET_ACCOUNT_SLOTS }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-5 font-mono text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <input
                  value={targetNames[index] ?? ''}
                  onChange={(e) => onNameChange(index, e.target.value)}
                  placeholder={`Account ${index + 1}`}
                  className="h-8 flex-1 rounded border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
                {index < TARGET_ACCOUNT_SLOTS - 1 && (
                  <button
                    type="button"
                    title={`Swap with account ${index + 2}`}
                    onClick={() => onSwap(index, index + 1)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ArrowLeftRight className="size-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2 border-t border-border pt-3">
            <p className="font-mono text-[10px] text-muted-foreground">
              Last refresh: {formatRefreshedAt(lastRefreshedAt)}
              {refreshSource ? ` · ${refreshSource}` : ''}
            </p>
            {statusMessage && (
              <p className="text-xs text-muted-foreground">{statusMessage}</p>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <Button
            className="mt-3 w-full gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {isRefreshing ? 'Refreshing…' : 'Refresh latest intel'}
          </Button>
        </div>
      )}
    </div>
  )
}
