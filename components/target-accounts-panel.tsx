'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeftRight, Loader2, RefreshCw, Settings2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TARGET_ACCOUNT_SLOTS } from '@/lib/refresh-accounts'
import {
  buildTargetConfigExport,
  type TargetConfigExport,
} from '@/lib/target-accounts-storage'

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
  onImport: (config: TargetConfigExport) => void
}

function formatRefreshedAt(iso: string | null): string {
  if (!iso) return 'Not refreshed yet'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
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
  onImport,
}: TargetAccountsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [panelStyle, setPanelStyle] = useState<{ top: number; right: number }>({
    top: 0,
    right: 16,
  })
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return

      const rect = trigger.getBoundingClientRect()
      setPanelStyle({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleRefresh = () => {
    onRefresh()
  }

  const handleExport = () => {
    const payload = buildTargetConfigExport()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `target-accounts-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as TargetConfigExport
      onImport(parsed)
      setImportError(null)
    } catch {
      setImportError('Could not read that file. Use a JSON export from this app.')
    }
  }

  const panel = isOpen && mounted ? (
    <>
      <button
        type="button"
        aria-label="Close target accounts panel"
        className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-[1px]"
        onClick={() => setIsOpen(false)}
      />
      <div
        role="dialog"
        aria-labelledby="target-accounts-title"
        className="fixed z-[70] w-[22rem] rounded-lg border border-border bg-card p-4 shadow-2xl"
        style={{ top: panelStyle.top, right: panelStyle.right }}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h2 id="target-accounts-title" className="text-sm font-medium text-foreground">
              5 Target Accounts
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Names save automatically in this browser. Export a backup to move them elsewhere.
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
              <span className="w-5 font-mono text-xs text-muted-foreground">{index + 1}</span>
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
          {statusMessage && <p className="text-xs text-muted-foreground">{statusMessage}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
          {importError && <p className="text-xs text-destructive">{importError}</p>}
        </div>

        <div className="mt-3 flex gap-2">
          <Button type="button" variant="outline" size="sm" className="flex-1" onClick={handleExport}>
            Export backup
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => importInputRef.current?.click()}
          >
            Import backup
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>

        <Button className="mt-3 w-full gap-2" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          {isRefreshing ? 'Refreshing…' : 'Refresh latest intel'}
        </Button>
      </div>
    </>
  ) : null

  return (
    <div ref={triggerRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((open) => !open)}
        className="gap-1.5"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Settings2 className="size-3.5" />
        Target Accounts
      </Button>
      {panel && createPortal(panel, document.body)}
    </div>
  )
}
