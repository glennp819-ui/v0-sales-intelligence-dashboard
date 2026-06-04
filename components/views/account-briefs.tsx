'use client'

import { useMemo } from 'react'
import { Building2, Users, DollarSign, Code } from 'lucide-react'
import { type Account, type CriteriaWeight, calculateTotalScore } from '@/lib/data'
import { cn } from '@/lib/utils'
import { CompanyLogo } from '@/components/company-logo'

interface AccountBriefsViewProps {
  accounts: Account[]
  weights: CriteriaWeight[]
  onAccountSelect: (account: Account) => void
}

const tierConfig = {
  1: { label: 'Strike Now', color: 'bg-[#10B981]' },
  2: { label: 'Build & Warm', color: 'bg-[#F59E0B]' },
  3: { label: 'Monitor', color: 'bg-[#737373]' },
}

export function AccountBriefsView({ accounts, weights, onAccountSelect }: AccountBriefsViewProps) {
  const accountsWithScores = useMemo(() => {
    return accounts.map((account) => ({
      account,
      score: calculateTotalScore(account, weights),
    }))
  }, [accounts, weights])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-foreground">Account Briefs</h2>
        <p className="text-sm text-muted-foreground">
          Quick reference cards for all tracked accounts. Click for full POV and stakeholder targets.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {accountsWithScores.map(({ account, score }) => {
          const tier = tierConfig[account.tier]
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onAccountSelect(account)}
              className="flex flex-col rounded border border-border bg-card text-left transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start justify-between border-b border-border p-4">
                <div className="flex items-start gap-3">
                  <CompanyLogo name={account.name} website={account.details.website} className="size-10" />
                  <div>
                    <h3 className="font-medium text-foreground">{account.name}</h3>
                    <p className="text-xs text-muted-foreground">{account.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn('rounded px-2 py-0.5 text-xs font-medium text-background', tier.color)}
                  >
                    {tier.label}
                  </span>
                  <span className="font-mono text-xl font-bold text-foreground">{score}</span>
                </div>
              </div>

              <div className="flex-1 p-4">
                <div className="mb-3 space-y-2 rounded bg-secondary/40 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Why anything?
                  </p>
                  <p className="line-clamp-2 text-xs text-foreground/90">{account.details.pov.whyAnything}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{account.details.employees}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate text-xs text-muted-foreground">
                      {account.details.funding.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {account.details.stakeholderTargets.length} stakeholder targets
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {account.details.techStack.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 border-t border-border pt-3">
                  <p className="line-clamp-2 text-xs text-muted-foreground">{account.details.battleNotes}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
