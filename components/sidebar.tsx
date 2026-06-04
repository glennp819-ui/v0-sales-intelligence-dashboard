'use client'

import {
  Target,
  ClipboardList,
  Swords,
  HelpCircle,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Section } from '@/app/page'

const navItems = [
  { id: 'prioritization' as Section, label: 'Prioritization', icon: Target },
  { id: 'icp-scorecard' as Section, label: 'ICP Scorecard', icon: ClipboardList },
  { id: 'battle-cards' as Section, label: 'Battle Cards', icon: Swords },
  { id: 'discovery-bank' as Section, label: 'Discovery Bank', icon: HelpCircle },
  { id: 'account-briefs' as Section, label: 'Account Briefs', icon: FileText },
]

interface SidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="flex w-56 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-4">
        <span className="font-mono text-sm font-medium tracking-tight text-foreground">
          cursor
        </span>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          Strategic AE Tools
        </p>
      </div>
    </aside>
  )
}
