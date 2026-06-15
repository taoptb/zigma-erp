import { NextResponse, type NextRequest } from 'next/server'
import { dispatchNotification } from '@/lib/adapters/notifications'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { shopId, event, channel, recipient, message, metadata, lineToken } = body

  if (!shopId || !event || !channel || !recipient || !message) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  await dispatchNotification(
    { shopId, event, channel, recipient, message, metadata },
    lineToken,
  )

  return NextResponse.json({ ok: true })
}
