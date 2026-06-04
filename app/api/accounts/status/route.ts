import { NextResponse } from 'next/server'

/** Read-only: whether production has OPENAI_API_KEY (no secret values exposed). */
export async function GET() {
  return NextResponse.json({
    aiEnabled: Boolean(process.env.OPENAI_API_KEY?.trim()),
  })
}
