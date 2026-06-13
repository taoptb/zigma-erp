import type { INotificationAdapter, NotificationPayload } from './types'

const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify'

export class LineNotifyAdapter implements INotificationAdapter {
  constructor(private readonly token: string) {}

  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    try {
      const body = new URLSearchParams({ message: `\n${payload.message}` })
      const res = await fetch(LINE_NOTIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.token}`,
        },
        body: body.toString(),
      })
      if (!res.ok) {
        const text = await res.text()
        return { success: false, error: `LINE Notify ${res.status}: ${text}` }
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }
}
