'use client'

import { navItems, type Section } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { CursorBrand } from '@/components/cursor-brand'

interface SidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-[3.75rem] items-center border-b border-border px-4">
        <CursorBrand variant="full" />
      </div>
      <nav className="flex-1 p-2.5" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border border-transparent py-2 pr-3 pl-2.5 text-sm transition-colors',
                    isActive
                      ? 'border-border bg-secondary text-foreground shadow-[inset_2px_0_0_0_var(--foreground)]'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Strategic AE Command Center
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/70">Cursor for Enterprise</p>
      </div>
    </aside>
  )
}
