import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'

import { accountSchema } from '@/lib/account-schema'
import { mockAccounts, type Account } from '@/lib/data'

export const TARGET_ACCOUNT_SLOTS = 5

export const DEFAULT_TARGET_NAMES = mockAccounts.map((a) => a.name)

export type RefreshSource = 'ai' | 'mock' | 'stub'

export interface RefreshResult {
  accounts: Account[]
  refreshedAt: string
  source: RefreshSource
  message?: string
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

export function findMockAccount(name: string): Account | undefined {
  const normalized = normalizeName(name)
  if (!normalized) return undefined

  return mockAccounts.find(
    (account) =>
      normalizeName(account.name) === normalized ||
      normalizeName(account.name).includes(normalized) ||
      normalized.includes(normalizeName(account.name))
  )
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function scoreFromHash(seed: string, offset: number, min = 45, max = 88): number {
  const value = hashString(`${seed}-${offset}`)
  return min + (value % (max - min + 1))
}

export function createStubAccount(name: string, slotIndex: number): Account {
  const trimmed = name.trim() || `Target Account ${slotIndex + 1}`
  const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return {
    id: `target-${slotIndex}-${slug}`,
    name: trimmed,
    industry: 'Technology',
    tier: 2,
    scores: {
      engineeringHeadcount: scoreFromHash(trimmed, 1),
      aiMlInvestment: scoreFromHash(trimmed, 2),
      toolingStack: scoreFromHash(trimmed, 3),
      fundingRecency: scoreFromHash(trimmed, 4),
      developerVelocity: scoreFromHash(trimmed, 5),
      championAccessibility: scoreFromHash(trimmed, 6, 40, 75),
      expansionPotential: scoreFromHash(trimmed, 7),
    },
    details: {
      website: `${slug.replace(/-+/g, '')}.com`,
      employees: 'Unknown — refresh with API key for live intel',
      funding: 'Research pending',
      techStack: ['TypeScript', 'Python', 'VS Code'],
      recentNews: [
        `Add OPENAI_API_KEY to refresh live intelligence for ${trimmed}.`,
        'Swap this account anytime from Target Accounts in the header.',
      ],
      champions: [
        {
          name: 'Engineering Leader',
          title: 'VP Engineering (placeholder)',
          linkedIn: 'linkedin.com',
        },
      ],
      discoveryQuestions: [
        `What is ${trimmed}'s current developer tooling evaluation process?`,
        `Where does ${trimmed} see the biggest engineering productivity gaps?`,
      ],
      battleNotes: `Placeholder profile for ${trimmed}. Run Refresh to pull latest signals.`,
    },
  }
}

function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

async function refreshWithAi(name: string, slotIndex: number): Promise<Account> {
  const today = new Date().toISOString().slice(0, 10)

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: accountSchema,
    prompt: `You are a sales intelligence analyst for Cursor (AI-native IDE) selling to enterprise engineering teams.

Research the company "${name}" as of ${today}. Return realistic, current B2B sales intelligence for a strategic account executive.

Requirements:
- id must be "target-${slotIndex}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"
- name must be "${name}"
- tier: 1 = strike now (strong fit), 2 = build & warm, 3 = monitor
- scores are 0-100 integers reflecting ICP fit for Cursor
- recentNews: 3 items with plausible 2024-2026 developments (mark uncertain items clearly)
- discoveryQuestions: tailored to selling Cursor to this company
- battleNotes: concise Cursor-specific positioning notes
- Use only information you are confident about; otherwise use conservative estimates and note uncertainty in battleNotes`,
  })

  return object
}

export function sanitizeTargetNames(names: string[]): string[] {
  const padded = [...names]
  while (padded.length < TARGET_ACCOUNT_SLOTS) {
    padded.push('')
  }

  return padded.slice(0, TARGET_ACCOUNT_SLOTS).map((name, index) => {
    const trimmed = name.trim()
    return trimmed || DEFAULT_TARGET_NAMES[index] || `Account ${index + 1}`
  })
}

export async function refreshAccounts(names: string[]): Promise<RefreshResult> {
  const targetNames = sanitizeTargetNames(names)
  const refreshedAt = new Date().toISOString()
  const useAi = hasOpenAiKey()

  if (useAi) {
    const accounts = await Promise.all(
      targetNames.map((name, index) => refreshWithAi(name, index))
    )

    return {
      accounts,
      refreshedAt,
      source: 'ai',
      message: 'Refreshed with live AI research.',
    }
  }

  const accounts = targetNames.map((name, index) => {
    const mockMatch = findMockAccount(name)
    if (mockMatch) {
      return {
        ...mockMatch,
        id: `target-${index}-${mockMatch.id}`,
        name: name.trim() || mockMatch.name,
      }
    }
    return createStubAccount(name, index)
  })

  const usedMock = accounts.some((_, i) => Boolean(findMockAccount(targetNames[i])))

  return {
    accounts,
    refreshedAt,
    source: usedMock ? 'mock' : 'stub',
    message:
      'Set OPENAI_API_KEY in .env.local for live refresh. Using bundled profiles where available.',
  }
}
