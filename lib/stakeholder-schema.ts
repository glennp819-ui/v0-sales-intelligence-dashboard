import { z } from 'zod'

export const stakeholderSchema = z.object({
  name: z.string(),
  title: z.string(),
  linkedIn: z.string(),
})

export const stakeholderReplaceSchema = z.object({
  accountName: z.string(),
  industry: z.string(),
  website: z.string(),
  existingStakeholders: z.array(stakeholderSchema),
  excludeNames: z.array(z.string()).default([]),
})
