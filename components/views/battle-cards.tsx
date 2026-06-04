import { battleCards } from '@/lib/data'
import { Shield, Target, AlertTriangle, Zap } from 'lucide-react'

export function BattleCardsView() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-foreground">
          Competitive Battle Cards
        </h2>
        <p className="text-sm text-muted-foreground">
          Positioning strategies and counter-arguments for key competitors.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {battleCards.map((card) => (
          <div
            key={card.competitor}
            className="flex flex-col rounded border border-border bg-card"
          >
            <div className="border-b border-border p-4">
              <h3 className="text-lg font-medium text-foreground">
                vs. {card.competitor}
              </h3>
              <p className="mt-1 text-xs text-foreground/80">
                {card.positioning}
              </p>
            </div>

            <div className="flex-1 space-y-4 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-[#10B981]" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Their Strengths
                  </span>
                </div>
                <ul className="space-y-1">
                  {card.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="text-xs text-foreground"
                    >
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Their Weaknesses
                  </span>
                </div>
                <ul className="space-y-1">
                  {card.weaknesses.map((weakness, index) => (
                    <li
                      key={index}
                      className="text-xs text-foreground"
                    >
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Counter Points
                  </span>
                </div>
                <ul className="space-y-1">
                  {card.counterPoints.map((point, index) => (
                    <li
                      key={index}
                      className="text-xs text-foreground"
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  Win Strategy
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground">
                {card.winStrategy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
