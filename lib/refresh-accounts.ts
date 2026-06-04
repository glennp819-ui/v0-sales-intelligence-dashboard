import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'

import { accountSchema } from '@/lib/account-schema'
import { generateTacticalPov } from '@/lib/generate-pov'
import { mockAccounts, type Account, type StakeholderTarget } from '@/lib/data'
import { fetchPublicInsights, formatPublicInsightsForPrompt } from '@/lib/public-insights'
import { stakeholderSchema } from '@/lib/stakeholder-schema'
import {
  calibrateAccountPortfolio,
  TIER_SCORING_GUIDANCE,
} from '@/lib/tier-calibration'

export const TARGET_ACCOUNT_SLOTS = 5
export const STAKEHOLDER_TARGET_COUNT = 5

/** v0 demo companies — only used to match and clear legacy saved defaults */
export const LEGACY_DEMO_TARGET_NAMES = mockAccounts.map((a) => a.name)

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

function scoreFromHash(seed: string, offset: number, min = 38, max = 72): number {
  const value = hashString(`${seed}-${offset}`)
  return min + (value % (max - min + 1))
}

const STUB_TITLES = [
  'VP Engineering',
  'Director of Platform',
  'Head of Developer Experience',
  'Staff Engineer',
  'Engineering Manager',
]

function stubStakeholders(name: string): StakeholderTarget[] {
  return Array.from({ length: STAKEHOLDER_TARGET_COUNT }, (_, i) => ({
    name: `${['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey'][i]} ${name.split(' ')[0] ?? 'Lead'}`,
    title: STUB_TITLES[i],
    linkedIn: 'linkedin.com',
  }))
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
      championAccessibility: scoreFromHash(trimmed, 6, 35, 68),
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
      stakeholderTargets: stubStakeholders(trimmed),
      discoveryQuestions: [
        `What is ${trimmed}'s current developer tooling evaluation process?`,
        `Where does ${trimmed} see the biggest engineering productivity gaps?`,
      ],
      battleNotes: `Placeholder profile for ${trimmed}. Run Refresh to pull latest signals.`,
      pov: {
        whyAnything: `${trimmed} invests in engineering productivity — AI-native tooling is a force multiplier at their scale.`,
        whyNow: 'Market pressure and AI adoption create urgency to modernize the developer stack this quarter.',
        whyCursor:
          'Cursor delivers codebase-aware AI in a familiar IDE — faster rollout than CLI-only or autocomplete-only tools.',
      },
    },
  }
}

function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

async function refreshWithAi(name: string, slotIndex: number): Promise<Account> {
  const today = new Date().toISOString().slice(0, 10)
  const insights = await fetchPublicInsights(name)
  const publicBlock = formatPublicInsightsForPrompt(insights)

  const { object: account } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: accountSchema,
    prompt: `You are a sales intelligence analyst for Cursor (AI-native IDE) selling to enterprise engineering teams.

Research the company "${name}" as of ${today}. Return realistic, current B2B sales intelligence for a strategic account executive.

PUBLIC INSIGHTS (use these for recentNews and context):
${publicBlock}

Requirements:
- id must be "target-${slotIndex}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"
- name must be "${name}"
- tier: preliminary label (1=strike now, 2=build & warm, 3=monitor) — final tier assigned after portfolio calibration
- scores are 0-100 integers reflecting ICP fit for Cursor (engineering headcount: 1,000+ engineers = high ICP signal)

${TIER_SCORING_GUIDANCE}
- stakeholderTargets: exactly 5 plausible engineering leaders to engage (mix of VP/Director/Staff/EM). Use realistic names and LinkedIn-style paths.
- recentNews: 3 items grounded in public headlines above where possible (mark uncertain items clearly)
- discoveryQuestions: tailored to selling Cursor to this company
- battleNotes: concise Cursor-specific positioning notes
- pov: write placeholder text (will be replaced by tactical POV pass)
- Use only information you are confident about; otherwise use conservative estimates and note uncertainty in battleNotes`,
  })

  const { pov } = await generateTacticalPov(
    {
      name: account.name,
      industry: account.industry,
      website: account.details.website,
      employees: account.details.employees,
      funding: account.details.funding,
      techStack: account.details.techStack,
      recentNews: account.details.recentNews,
      battleNotes: account.details.battleNotes,
      tier: account.tier,
    },
    insights
  )

  return {
    ...account,
    details: {
      ...account.details,
      pov,
    },
  }
}

export function sanitizeTargetNames(names: string[]): string[] {
  const padded = [...names]
  while (padded.length < TARGET_ACCOUNT_SLOTS) {
    padded.push('')
  }

  return padded.slice(0, TARGET_ACCOUNT_SLOTS).map((name, index) => {
    const trimmed = name.trim()
    return trimmed || `Account ${index + 1}`
  })
}

export async function refreshAccounts(names: string[]): Promise<RefreshResult> {
  const targetNames = sanitizeTargetNames(names)
  const refreshedAt = new Date().toISOString()
  const useAi = hasOpenAiKey()

  if (useAi) {
    const rawAccounts = await Promise.all(
      targetNames.map((name, index) => refreshWithAi(name, index))
    )
    const accounts = calibrateAccountPortfolio(rawAccounts)

    return {
      accounts,
      refreshedAt,
      source: 'ai',
      message: 'Refreshed with live AI research, calibrated scores, and public-news POV.',
    }
  }

  const rawAccounts = targetNames.map((name, index) => {
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

  const accounts = calibrateAccountPortfolio(rawAccounts)

  const usedMock = accounts.some((_, i) => Boolean(findMockAccount(targetNames[i])))

  return {
    accounts,
    refreshedAt,
    source: usedMock ? 'mock' : 'stub',
    message:
      'Set OPENAI_API_KEY in .env.local for live refresh. Using bundled profiles where available.',
  }
}

export interface ReplaceStakeholderInput {
  accountName: string
  industry: string
  website: string
  existingStakeholders: StakeholderTarget[]
  excludeNames: string[]
}

function stubReplaceStakeholder(input: ReplaceStakeholderInput): StakeholderTarget {
  const seed = `${input.accountName}-${input.excludeNames.join('-')}-${Date.now()}`
  const idx = hashString(seed) % STUB_TITLES.length
  return {
    name: `New Contact ${hashString(seed) % 900 + 100}`,
    title: STUB_TITLES[idx],
    linkedIn: 'linkedin.com',
  }
}

export async function replaceStakeholder(input: ReplaceStakeholderInput): Promise<StakeholderTarget> {
  if (!hasOpenAiKey()) {
    return stubReplaceStakeholder(input)
  }

  const excludeList = input.excludeNames.join(', ') || 'none'

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: stakeholderSchema,
    prompt: `Suggest ONE new stakeholder target for a Cursor (AI IDE) enterprise sales motion.

Company: ${input.accountName}
Industry: ${input.industry}
Website: ${input.website}

Current stakeholder targets (keep these — suggest someone different):
${input.existingStakeholders.map((s) => `- ${s.name}, ${s.title}`).join('\n')}

Do NOT suggest anyone named: ${excludeList}

Return a plausible engineering leader (VP, Director, Staff, EM, or Head of DX) with a realistic name and LinkedIn path.
Prefer roles likely to own developer tooling decisions.`,
  })

  return object
}
