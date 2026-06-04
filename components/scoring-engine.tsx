'use client'

import { type CriteriaWeight } from '@/lib/data'
import { normalizeWeightsOnChange } from '@/lib/normalize-weights'

interface ScoringEngineProps {
  weights: CriteriaWeight[]
  onWeightsChange: (weights: CriteriaWeight[]) => void
}

export function ScoringEngine({ weights, onWeightsChange }: ScoringEngineProps) {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)

  const handleWeightChange = (id: string, newWeight: number) => {
    onWeightsChange(normalizeWeightsOnChange(weights, id, newWeight))
  }

  return (
    <div className="rounded border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-medium text-foreground">Scoring Engine</h3>
      <div className="space-y-4">
        {weights.map((criterion) => (
          <div key={criterion.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">{criterion.label}</label>
              <span className="font-mono text-xs text-foreground">{criterion.weight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={criterion.weight}
              onChange={(e) => handleWeightChange(criterion.id, parseInt(e.target.value, 10))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-secondary [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-foreground"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Weights auto-balance to 100%</span>
          <span className="font-mono text-xs text-[#10B981]">{totalWeight}%</span>
        </div>
      </div>
    </div>
  )
}
