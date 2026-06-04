import type { Section } from '@/lib/nav'
import { TargetAccountsPanel } from '@/components/target-accounts-panel'
import type { TargetConfigExport } from '@/lib/target-accounts-storage'

const sectionTitles: Record<Section, string> = {
  prioritization: 'Prioritization',
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
  aiRefreshEnabled: boolean | null
  statusMessage: string | null
  refreshError: string | null
  onTargetNameChange: (index: number, value: string) => void
  onSwapTargetNames: (indexA: number, indexB: number) => void
  onRefreshAccounts: () => void
  onImportTargets: (config: TargetConfigExport) => void
}

export function TopBar({
  activeSection,
  targetNames,
  isRefreshing,
  lastRefreshedAt,
  refreshSource,
  aiRefreshEnabled,
  statusMessage,
  refreshError,
  onTargetNameChange,
  onSwapTargetNames,
  onRefreshAccounts,
  onImportTargets,
}: TopBarProps) {
  return (
    <header className="relative z-10 flex h-[3.75rem] shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-sm">
      <div className="min-w-0">
        <h1 className="text-sm font-medium tracking-[-0.01em] text-foreground">
          {sectionTitles[activeSection]}
        </h1>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          PG Prioritization · Enterprise accounts
        </p>
      </div>
      <div className="flex items-center gap-3">
        <TargetAccountsPanel
          targetNames={targetNames}
          isRefreshing={isRefreshing}
          lastRefreshedAt={lastRefreshedAt}
          refreshSource={refreshSource}
          aiRefreshEnabled={aiRefreshEnabled}
          statusMessage={statusMessage}
          error={refreshError}
          onNameChange={onTargetNameChange}
          onSwap={onSwapTargetNames}
          onRefresh={onRefreshAccounts}
          onImport={onImportTargets}
        />
      </div>
    </header>
  )
}
