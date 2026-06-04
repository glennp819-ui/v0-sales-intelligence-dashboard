'use client'

import { useEffect, useRef } from 'react'
import { X, ExternalLink, Link2, ArrowRight, Loader2, Trash2, RefreshCw } from 'lucide-react'
import { type Account, type CriteriaWeight, calculateTotalScore } from '@/lib/data'
import { isGenericPov } from '@/lib/pov-schema'
import { scoreBarColor, scoreTextColor } from '@/lib/score-colors'
import { cn } from '@/lib/utils'
import { CompanyLogo } from '@/components/company-logo'
import { Button } from '@/components/ui/button'

interface AccountDetailPanelProps {
  account: Account | null
  weights: CriteriaWeight[]
  isOpen: boolean
  replacingStakeholderKey: string | null
  refreshingPovAccountId: string | null
  onClose: () => void
  onReplaceStakeholder: (accountId: string, stakeholderIndex: number) => void
  onRefreshPov: (accountId: string) => void
}

const tierConfig = {
  1: { label: 'Strike Now', color: 'bg-[#10B981]' },
  2: { label: 'Build & Warm', color: 'bg-[#F59E0B]' },
  3: { label: 'Monitor', color: 'bg-[#737373]' },
}

const scoreKeys = [
  { id: 'engineeringHeadcount', key: 'engineeringHeadcount' as const, label: 'Engineering Headcount' },
  { id: 'aiMlInvestment', key: 'aiMlInvestment' as const, label: 'AI/ML Investment' },
  { id: 'toolingStack', key: 'toolingStack' as const, label: 'Tooling Stack' },
  { id: 'fundingRecency', key: 'fundingRecency' as const, label: 'Funding Recency' },
  { id: 'developerVelocity', key: 'developerVelocity' as const, label: 'Developer Velocity' },
  { id: 'championAccessibility', key: 'championAccessibility' as const, label: 'Stakeholder Access' },
  { id: 'expansionPotential', key: 'expansionPotential' as const, label: 'Expansion Potential' },
]

const povItems = [
  { key: 'whyAnything' as const, label: 'Why anything?' },
  { key: 'whyNow' as const, label: 'Why now?' },
  { key: 'whyCursor' as const, label: 'Why Cursor?' },
]

export function AccountDetailPanel({
  account,
  weights,
  isOpen,
  replacingStakeholderKey,
  refreshingPovAccountId,
  onClose,
  onReplaceStakeholder,
  onRefreshPov,
}: AccountDetailPanelProps) {
  const autoPovAttempted = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!account || !isOpen) return
    if (refreshingPovAccountId === account.id) return
    if (!isGenericPov(account.details.pov)) return
    if (autoPovAttempted.current.has(account.id)) return

    autoPovAttempted.current.add(account.id)
    onRefreshPov(account.id)
  }, [account, isOpen, onRefreshPov, refreshingPovAccountId])

  if (!account) return null

  const isRefreshingPov = refreshingPovAccountId === account.id
  const povIsGeneric = isGenericPov(account.details.pov)

  const score = calculateTotalScore(account, weights)
  const tier = tierConfig[account.tier]
  const weightMap = weights.reduce((acc, w) => ({ ...acc, [w.id]: w.weight }), {} as Record<string, number>)

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-auto border-l border-border bg-background transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
            <CompanyLogo name={account.name} website={account.details.website} className="size-9" />
            <h2 className="text-lg font-medium text-foreground">{account.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('rounded px-2 py-0.5 text-xs font-medium text-background', tier.color)}>
              {tier.label}
            </span>
            <span className="font-mono text-2xl font-bold text-foreground">{score}</span>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* POV */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account POV
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                disabled={isRefreshingPov}
                onClick={() => onRefreshPov(account.id)}
              >
                {isRefreshingPov ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <RefreshCw className="size-3" />
                )}
                {isRefreshingPov ? 'Researching…' : 'Refresh POV'}
              </Button>
            </div>
            {povIsGeneric && !isRefreshingPov && (
              <p className="text-xs text-muted-foreground">
                POV looks generic — refresh pulls Google News + Wikipedia signals for a tactical take.
              </p>
            )}
            <div
              className={cn(
                'space-y-3 rounded border border-border bg-card p-4 transition-opacity',
                isRefreshingPov && 'opacity-60'
              )}
            >
              {isRefreshingPov && (
                <p className="text-xs text-muted-foreground">Pulling public headlines and generating tactical POV…</p>
              )}
              {povItems.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="mt-1 text-sm text-foreground">{account.details.pov[key]}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Company Info */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Company Info
            </h3>
            <div className="grid grid-cols-2 gap-4 rounded border border-border bg-card p-4">
              <div>
                <span className="text-xs text-muted-foreground">Website</span>
                <a
                  href={`https://${account.details.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-foreground underline-offset-2 hover:underline"
                >
                  {account.details.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Employees</span>
                <p className="text-sm text-foreground">{account.details.employees}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Industry</span>
                <p className="text-sm text-foreground">{account.industry}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Funding</span>
                <p className="text-sm text-foreground">{account.details.funding}</p>
              </div>
            </div>
          </section>

          {/* Score Breakdown */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Score Breakdown
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-[#10B981]" /> 75+
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-[#F59E0B]" /> 50–74
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-2 rounded-full bg-[#EF4444]" /> &lt;50
                </span>
              </div>
            </div>
            <div className="space-y-2 rounded border border-border bg-card p-4">
              {scoreKeys.map(({ id, key, label }) => {
                const scoreValue = account.scores[key]
                const weight = weightMap[id] || 0
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className="w-32 text-xs text-muted-foreground">{label}</span>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn('h-full transition-all', scoreBarColor(scoreValue))}
                          style={{ width: `${scoreValue}%` }}
                        />
                      </div>
                    </div>
                    <span className={cn('w-8 text-right font-mono text-xs font-medium', scoreTextColor(scoreValue))}>
                      {scoreValue}
                    </span>
                    <span className="w-12 text-right font-mono text-xs text-muted-foreground">{weight}%</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {account.details.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-border bg-secondary px-2 py-1 font-mono text-xs text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Stakeholder Targets */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Stakeholder Targets
            </h3>
            <div className="space-y-2">
              {account.details.stakeholderTargets.map((stakeholder, index) => {
                const replaceKey = `${account.id}-${index}`
                const isReplacing = replacingStakeholderKey === replaceKey

                return (
                  <div
                    key={`${stakeholder.name}-${index}`}
                    className="flex items-center justify-between rounded border border-border bg-card p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{stakeholder.name}</p>
                      <p className="text-xs text-muted-foreground">{stakeholder.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href={`https://${stakeholder.linkedIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-primary"
                        aria-label={`LinkedIn for ${stakeholder.name}`}
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                      <button
                        type="button"
                        disabled={isReplacing}
                        onClick={() => onReplaceStakeholder(account.id, index)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        title="Remove and suggest a new stakeholder"
                        aria-label={`Replace ${stakeholder.name}`}
                      >
                        {isReplacing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recent News */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent News
            </h3>
            <ul className="space-y-2 rounded border border-border bg-card p-4">
              {account.details.recentNews.map((news, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{news}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Discovery Questions */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Discovery Questions
            </h3>
            <ul className="space-y-2 rounded border border-border bg-card p-4">
              {account.details.discoveryQuestions.map((question, index) => (
                <li key={index} className="text-sm text-foreground">
                  {index + 1}. {question}
                </li>
              ))}
            </ul>
          </section>

          {/* Battle Notes */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Battle Notes
            </h3>
            <div className="rounded border border-border bg-card p-4">
              <p className="text-sm text-foreground">{account.details.battleNotes}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
