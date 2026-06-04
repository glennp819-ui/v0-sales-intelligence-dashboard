import { z } from 'zod'

import { stakeholderSchema } from '@/lib/stakeholder-schema'

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  scores: z.object({
    engineeringHeadcount: z.number().min(0).max(100),
    aiMlInvestment: z.number().min(0).max(100),
    toolingStack: z.number().min(0).max(100),
    fundingRecency: z.number().min(0).max(100),
    developerVelocity: z.number().min(0).max(100),
    championAccessibility: z.number().min(0).max(100),
    expansionPotential: z.number().min(0).max(100),
  }),
  details: z.object({
    website: z.string(),
    employees: z.string(),
    funding: z.string(),
    techStack: z.array(z.string()).min(1).max(8),
    recentNews: z.array(z.string()).min(1).max(5),
    stakeholderTargets: z.array(stakeholderSchema).length(5),
    discoveryQuestions: z.array(z.string()).min(2).max(5),
    battleNotes: z.string(),
    pov: z.object({
      whyAnything: z.string(),
      whyNow: z.string(),
      whyCursor: z.string(),
    }),
  }),
})

export type AccountPayload = z.infer<typeof accountSchema>
