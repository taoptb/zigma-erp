export interface NotificationPayload {
  event: string
  shopId: string
  recipient: string
  message: string
  metadata?: Record<string, unknown>
}

export interface INotificationAdapter {
  send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }>
}
