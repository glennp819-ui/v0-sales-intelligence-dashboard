'use client'

import { useMemo } from 'react'
import { type Account, type CriteriaWeight, calculateTotalScore } from '@/lib/data'
import { ScoringEngine } from '@/components/scoring-engine'
import { AccountCard } from '@/components/account-card'

interface PrioritizationViewProps {
  accounts: Account[]
  weights: CriteriaWeight[]
  onWeightsChange: (weights: CriteriaWeight[]) => void
  onAccountSelect: (account: Account) => void
}

export function PrioritizationView({
  accounts,
  weights,
  onWeightsChange,
  onAccountSelect,
}: PrioritizationViewProps) {
  const rankedAccounts = useMemo(() => {
    return [...accounts]
      .map((account) => ({
        account,
        score: calculateTotalScore(account, weights),
      }))
      .sort((a, b) => b.score - a.score)
  }, [accounts, weights])

  return (
    <div className="flex gap-6">
      <div className="w-80 shrink-0">
        <ScoringEngine weights={weights} onWeightsChange={onWeightsChange} />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">
            Ranked Accounts
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {rankedAccounts.length} accounts
          </span>
        </div>
        <div className="space-y-3">
          {rankedAccounts.map(({ account, score }, index) => (
            <AccountCard
              key={account.id}
              account={account}
              score={score}
              rank={index + 1}
              weights={weights}
              onClick={() => onAccountSelect(account)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
