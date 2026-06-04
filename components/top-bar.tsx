import type { Section } from '@/app/page'

const sectionTitles: Record<Section, string> = {
  'prioritization': 'Prioritization',
  'icp-scorecard': 'ICP Scorecard',
  'battle-cards': 'Battle Cards',
  'discovery-bank': 'Discovery Bank',
  'account-briefs': 'Account Briefs',
}

interface TopBarProps {
  activeSection: Section
}

export function TopBar({ activeSection }: TopBarProps) {
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
      <div className="flex items-center gap-2 rounded border border-border px-2 py-1">
        <span className="font-mono text-xs text-muted-foreground">
          Built in
        </span>
        <span className="font-mono text-xs font-medium text-primary">
          Cursor
        </span>
      </div>
    </header>
  )
}
