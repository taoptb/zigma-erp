import { createClient } from '@supabase/supabase-js'
import type { Database, Json } from '@/types/database.types'
import { SmsAdapter } from './sms-adapter'
import { LineNotifyAdapter } from './line-adapter'
import type { NotificationPayload } from './types'

type Channel = 'sms' | 'line' | 'in_app'

export async function dispatchNotification(
  payload: NotificationPayload & { channel: Channel },
  shopLineToken?: string,
): Promise<void> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  let success = false
  let errorMsg: string | undefined

  if (payload.channel === 'sms') {
    const apiKey = process.env.SMS_API_KEY
    const apiUrl = process.env.SMS_API_URL
    if (!apiKey || !apiUrl) {
      errorMsg = 'SMS not configured'
    } else {
      const adapter = new SmsAdapter(apiKey, process.env.SMS_SENDER_NAME ?? 'ZigmaERP', apiUrl)
      const result = await adapter.send(payload)
      success = result.success
      errorMsg = result.error
    }
  } else if (payload.channel === 'line') {
    const token = shopLineToken ?? process.env.LINE_NOTIFY_TOKEN
    if (!token) {
      errorMsg = 'LINE Notify token not configured'
    } else {
      const adapter = new LineNotifyAdapter(token)
      const result = await adapter.send(payload)
      success = result.success
      errorMsg = result.error
    }
  } else {
    success = true
  }

  const notConfigured = errorMsg === 'SMS not configured' || errorMsg === 'LINE Notify token not configured'

  await supabase.from('notification_logs').insert({
    shop_id: payload.shopId,
    event: payload.event as Database['public']['Enums']['notification_event'],
    channel: payload.channel as Database['public']['Enums']['notification_channel'],
    recipient: payload.recipient,
    payload: (payload.metadata ?? {}) as Json,
    status: success ? 'sent' : notConfigured ? 'pending' : 'failed',
    error_msg: errorMsg ?? null,
    sent_at: success ? new Date().toISOString() : null,
  })
}
