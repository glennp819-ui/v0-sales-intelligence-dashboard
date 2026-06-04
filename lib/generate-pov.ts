import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'

import {
  type AccountPov,
  type PovGenerationContext,
  povSchema,
} from '@/lib/pov-schema'
import {
  fetchPublicInsights,
  formatPublicInsightsForPrompt,
  type PublicInsights,
} from '@/lib/public-insights'

function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

function stubTacticalPov(context: PovGenerationContext, insights: PublicInsights): AccountPov {
  const headline = insights.headlines[0] ?? context.recentNews[0] ?? `${context.name} digital initiatives`
  const wiki = insights.wikiSummary?.slice(0, 120) ?? context.industry

  return {
    whyAnything: `${context.name} (${context.industry}, ${context.employees} employees) faces pressure to ship faster across ${context.techStack.slice(0, 3).join(', ')} — legacy tooling slows ${wiki.includes('financial') ? 'compliance-heavy' : 'complex'} codebases.`,
    whyNow: `Public signal: "${headline}" — plus ${context.funding} and active ${context.industry.toLowerCase()} competition make H1 2026 the window to standardize AI-native dev workflows before budgets lock.`,
    whyCursor: `${context.name}'s stack (${context.techStack.slice(0, 2).join(', ')}) fits Cursor's VS Code fork — codebase-wide context beats Copilot autocomplete and is easier to roll out org-wide than CLI-only Claude Code.`,
  }
}

export async function generateTacticalPov(
  context: PovGenerationContext,
  existingInsights?: PublicInsights
): Promise<{ pov: AccountPov; insights: PublicInsights }> {
  const insights = existingInsights ?? (await fetchPublicInsights(context.name))

  if (!hasOpenAiKey()) {
    return { pov: stubTacticalPov(context, insights), insights }
  }

  const today = new Date().toISOString().slice(0, 10)
  const publicBlock = formatPublicInsightsForPrompt(insights)

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: povSchema,
    prompt: `You are a strategic account executive writing a TACTICAL POV to sell Cursor (AI-native IDE) to "${context.name}".

Today: ${today}

${publicBlock}

ACCOUNT INTELLIGENCE (internal research):
- Industry: ${context.industry}
- Website: ${context.website}
- Employees: ${context.employees}
- Funding: ${context.funding}
- Tier: ${context.tier} (1=strike now, 2=build, 3=monitor)
- Tech stack: ${context.techStack.join(', ')}
- Recent news (research): ${context.recentNews.join(' | ')}
- Battle notes: ${context.battleNotes}

Write three DISTINCT paragraphs for an AE preparing an outbound or QBR:

1. whyAnything — Why does THIS company need to change dev tooling at all? Tie to their industry, scale, and engineering pain. Name the business outcome at risk (velocity, quality, cost, security, talent retention).

2. whyNow — Why engage THIS quarter? Cite at least ONE specific public trigger from the headlines or news above (launch, acquisition, earnings theme, regulation, hiring push, AI initiative). Include a timeframe (Q1/Q2 2026, "this fiscal year", etc.).

3. whyCursor — Why Cursor specifically for THIS account? Reference their stack/culture and differentiate vs GitHub Copilot, Claude Code, and Windsurf.

RULES:
- Each field must be 2-4 sentences, concrete, and unique to ${context.name}.
- Reference real public signals where possible; if uncertain, say "likely" or "reported" — never invent specific dollar amounts not in the sources.
- FORBIDDEN generic filler like "engineering productivity is a priority" without naming WHY for this company.
- Do NOT copy the same sentence structure across the three fields.`,
  })

  return { pov: object, insights }
}
