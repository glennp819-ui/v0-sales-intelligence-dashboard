import type { Section } from '@/app/page'
import { TargetAccountsPanel } from '@/components/target-accounts-panel'

const sectionTitles: Record<Section, string> = {
  'prioritization': 'Prioritization',
  'icp-scorecard': 'ICP Scorecard',
  'battle-cards': 'Battle Cards',
  'discovery-bank': 'Discovery Bank',
  'account-briefs': 'Account Briefs',
}

interface TopBarProps {
  activeSection: Section
  targetNames: string[]
  isRefreshing: boolean
  lastRefreshedAt: string | null
  refreshSource: string | null
  statusMessage: string | null
  refreshError: string | null
  onTargetNameChange: (index: number, value: string) => void
  onSwapTargetNames: (indexA: number, indexB: number) => void
  onRefreshAccounts: () => void
}

export function TopBar({
  activeSection,
  targetNames,
  isRefreshing,
  lastRefreshedAt,
  refreshSource,
  statusMessage,
  refreshError,
  onTargetNameChange,
  onSwapTargetNames,
  onRefreshAccounts,
}: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-medium text-foreground">
          {sectionTitles[activeSection]}
        </h1>
        <span className="text-xs text-muted-foreground">
          PG Prioritization Command Center
        </span>
      </div>
      <div className="flex items-center gap-3">
        <TargetAccountsPanel
          targetNames={targetNames}
          isRefreshing={isRefreshing}
          lastRefreshedAt={lastRefreshedAt}
          refreshSource={refreshSource}
          statusMessage={statusMessage}
          error={refreshError}
          onNameChange={onTargetNameChange}
          onSwap={onSwapTargetNames}
          onRefresh={onRefreshAccounts}
        />
        <div className="flex items-center gap-2 rounded border border-border px-2 py-1">
          <span className="font-mono text-xs text-muted-foreground">
            Built in
          </span>
          <span className="font-mono text-xs font-medium text-primary">
            Cursor
          </span>
        </div>
      </div>
    </header>
  )
}
