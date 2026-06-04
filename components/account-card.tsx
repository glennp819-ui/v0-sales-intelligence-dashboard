'use client'

import { type Account, type CriteriaWeight } from '@/lib/data'
import { scoreBarColor, scoreTextColor } from '@/lib/score-colors'
import { cn } from '@/lib/utils'
import { CompanyLogo } from '@/components/company-logo'

interface AccountCardProps {
  account: Account
  score: number
  rank: number
  weights: CriteriaWeight[]
  onClick: () => void
}

const tierConfig = {
  1: { label: 'Strike Now', color: 'bg-[#10B981]', textColor: 'text-[#10B981]' },
  2: { label: 'Build & Warm', color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]' },
  3: { label: 'Monitor', color: 'bg-[#737373]', textColor: 'text-[#737373]' },
}

const scoreBreakdown = [
  { id: 'engineeringHeadcount', key: 'engineeringHeadcount' as const },
  { id: 'aiMlInvestment', key: 'aiMlInvestment' as const },
  { id: 'toolingStack', key: 'toolingStack' as const },
  { id: 'fundingRecency', key: 'fundingRecency' as const },
  { id: 'developerVelocity', key: 'developerVelocity' as const },
  { id: 'championAccessibility', key: 'championAccessibility' as const },
  { id: 'expansionPotential', key: 'expansionPotential' as const },
]

export function AccountCard({ account, score, rank, weights, onClick }: AccountCardProps) {
  const tier = tierConfig[account.tier]
  const weightMap = weights.reduce((acc, w) => ({ ...acc, [w.id]: w }), {} as Record<string, CriteriaWeight>)

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded border border-border bg-card p-4 text-left transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">#{rank}</span>
          <CompanyLogo name={account.name} website={account.details.website} className="size-8" />
          <div>
            <h3 className="font-medium text-foreground">{account.name}</h3>
            <span className="text-xs text-muted-foreground">{account.industry}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('rounded px-2 py-0.5 text-xs font-medium', tier.color, 'text-background')}>
            {tier.label}
          </span>
          <span className="font-mono text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <div className="mt-4 flex h-2 gap-0.5 overflow-hidden rounded-sm">
        {scoreBreakdown.map(({ id, key }) => {
          const weight = weightMap[id]?.weight || 0
          const scoreValue = account.scores[key]
          const contribution = (scoreValue * weight) / 100
          return (
            <div
              key={id}
              className={cn('opacity-90', scoreBarColor(scoreValue))}
              style={{ width: `${contribution}%` }}
              title={`${weightMap[id]?.label}: ${scoreValue}`}
            />
          )
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
        {scoreBreakdown.map(({ id, key }) => {
          const scoreValue = account.scores[key]
          return (
            <span key={id} className={cn('font-mono text-[10px]', scoreTextColor(scoreValue))}>
              {weightMap[id]?.shortLabel}: {scoreValue}
            </span>
          )
        })}
      </div>
    </button>
  )
}
