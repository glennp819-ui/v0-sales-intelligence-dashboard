'use client'

import { X, ExternalLink, Linkedin, ArrowRight } from 'lucide-react'
import { type Account, type CriteriaWeight, calculateTotalScore } from '@/lib/data'
import { cn } from '@/lib/utils'

interface AccountDetailPanelProps {
  account: Account | null
  weights: CriteriaWeight[]
  isOpen: boolean
  onClose: () => void
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
  { id: 'championAccessibility', key: 'championAccessibility' as const, label: 'Champion Access' },
  { id: 'expansionPotential', key: 'expansionPotential' as const, label: 'Expansion Potential' },
]

export function AccountDetailPanel({ account, weights, isOpen, onClose }: AccountDetailPanelProps) {
  if (!account) return null

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
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
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
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
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
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Score Breakdown
            </h3>
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
                          className="h-full bg-primary"
                          style={{ width: `${scoreValue}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-16 text-right font-mono text-xs text-foreground">
                      {scoreValue}
                    </span>
                    <span className="w-12 text-right font-mono text-xs text-muted-foreground">
                      {weight}%
                    </span>
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

          {/* Champions */}
          <section className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Champions
            </h3>
            <div className="space-y-2">
              {account.details.champions.map((champion) => (
                <div
                  key={champion.name}
                  className="flex items-center justify-between rounded border border-border bg-card p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{champion.name}</p>
                    <p className="text-xs text-muted-foreground">{champion.title}</p>
                  </div>
                  <a
                    href={`https://${champion.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              ))}
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
