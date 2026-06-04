import { NextResponse } from 'next/server'

import { refreshAccounts, sanitizeTargetNames } from '@/lib/refresh-accounts'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { names?: string[] }
    const names = sanitizeTargetNames(body.names ?? [])

    const result = await refreshAccounts(names)

    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to refresh account intelligence'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
