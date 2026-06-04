import { NextResponse } from 'next/server'

import { generateTacticalPov } from '@/lib/generate-pov'
import type { PovGenerationContext } from '@/lib/pov-schema'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      account?: PovGenerationContext
    }

    if (!body.account?.name) {
      return NextResponse.json({ error: 'Account context required' }, { status: 400 })
    }

    const { pov, insights } = await generateTacticalPov(body.account)

    return NextResponse.json({
      pov,
      insightCount: insights.headlines.length,
      hasWiki: Boolean(insights.wikiSummary),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate POV'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
