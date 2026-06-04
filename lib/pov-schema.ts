import { z } from 'zod'

export const povSchema = z.object({
  whyAnything: z.string().min(40),
  whyNow: z.string().min(40),
  whyCursor: z.string().min(40),
})

export type AccountPov = z.infer<typeof povSchema>

/** Migration / placeholder POV — triggers a tactical refresh. */
const GENERIC_POV_SNIPPETS = [
  'Engineering velocity and AI tooling are strategic priorities for',
  'Recent funding, product launches, or hiring signals create a window to engage',
  'Cursor offers an AI-native IDE with codebase-wide context',
  'invests in engineering productivity — AI-native tooling is a force multiplier',
  'Market pressure and AI adoption create urgency to modernize the developer stack',
  'Cursor delivers codebase-aware AI in a familiar IDE',
]

export function isGenericPov(pov: AccountPov): boolean {
  const combined = `${pov.whyAnything} ${pov.whyNow} ${pov.whyCursor}`.toLowerCase()
  const matches = GENERIC_POV_SNIPPETS.filter((s) => combined.includes(s.toLowerCase()))
  return matches.length >= 2
}

export interface PovGenerationContext {
  name: string
  industry: string
  website: string
  employees: string
  funding: string
  techStack: string[]
  recentNews: string[]
  battleNotes: string
  tier: 1 | 2 | 3
}
