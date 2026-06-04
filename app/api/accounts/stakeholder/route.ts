import { NextResponse } from 'next/server'

import { replaceStakeholder, sanitizeTargetNames } from '@/lib/refresh-accounts'
import { stakeholderReplaceSchema } from '@/lib/stakeholder-schema'

export async function POST(request: Request) {
  try {
    const body = stakeholderReplaceSchema.parse(await request.json())
    const stakeholder = await replaceStakeholder(body)

    return NextResponse.json({ stakeholder })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to replace stakeholder target'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
