import type { INotificationAdapter, NotificationPayload } from './types'

export class SmsAdapter implements INotificationAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly senderName: string,
    private readonly apiUrl: string,
  ) {}

  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          to: payload.recipient,
          from: this.senderName,
          message: payload.message,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        return { success: false, error: `SMS API ${res.status}: ${text}` }
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }
}
