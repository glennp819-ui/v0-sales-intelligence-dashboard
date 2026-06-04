import { icpCriteria } from '@/lib/data'
import { Check } from 'lucide-react'

export function IcpScorecardView() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-foreground">
          Ideal Customer Profile Scorecard
        </h2>
        <p className="text-sm text-muted-foreground">
          Criteria for identifying high-potential accounts for Cursor adoption.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {icpCriteria.map((category) => (
          <div
            key={category.category}
            className="rounded border border-border bg-card p-4"
          >
            <h3 className="mb-4 text-sm font-medium text-foreground">
              {category.category}
            </h3>
            <div className="space-y-4">
              {category.items.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        item.weight === 'High'
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}
                    >
                      {item.weight}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-secondary px-2 py-1.5">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="font-mono text-xs text-foreground">
                      {item.ideal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Scoring Logic
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-mono text-[#10B981]">Tier 1 (Strike Now)</span>:
            {" "}Top portfolio rank (max 3) with calibrated score 70+ and strong high-weight signals.
          </p>
          <p>
            <span className="font-mono text-[#F59E0B]">Tier 2 (Build & Warm)</span>:
            {" "}Solid fit with 1–2 gaps — nurture and prove value before a broad rollout.
          </p>
          <p>
            <span className="font-mono text-[#737373]">Tier 3 (Monitor)</span>:
            {" "}Weakest fit in the portfolio or missing critical signals — track for future triggers.
          </p>
          <p className="text-xs">
            Scores use a skeptical calibration (~12% discount). Each refresh enforces max 3 Strike Now,
            min 1 Build &amp; Warm, and min 1 Monitor.
          </p>
        </div>
      </div>
    </div>
  )
}
