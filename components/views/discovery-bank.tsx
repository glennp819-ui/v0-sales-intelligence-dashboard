'use client'

import { useState } from 'react'
import { discoveryQuestions } from '@/lib/data'
import { Copy, Check, MessageSquare } from 'lucide-react'

export function DiscoveryBankView() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleCopy = async (text: string, index: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-foreground">
          Discovery Question Bank
        </h2>
        <p className="text-sm text-muted-foreground">
          Strategic questions organized by discovery stage. Click to copy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {discoveryQuestions.map((category) => (
          <div
            key={category.category}
            className="rounded border border-border bg-card"
          >
            <div className="flex items-center gap-2 border-b border-border p-4">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">
                {category.category}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {category.questions.map((item, index) => {
                const key = `${category.category}-${index}`
                const isCopied = copiedIndex === key
                return (
                  <button
                    key={index}
                    onClick={() => handleCopy(item.question, key)}
                    className="group flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground">
                        {item.question}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Purpose: {item.purpose}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isCopied ? (
                        <Check className="h-4 w-4 text-[#10B981]" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
