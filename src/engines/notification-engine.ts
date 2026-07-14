export type NotificationType = 'success' | 'info' | 'warning' | 'achievement'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
}

type Listener = (notifications: Notification[]) => void

export class NotificationEngine {
  private notifications: Notification[] = []
  private listeners = new Set<Listener>()

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.notifications)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    this.listeners.forEach((l) => l([...this.notifications]))
  }

  push(type: NotificationType, title: string, message: string) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
    }
    this.notifications = [notification, ...this.notifications].slice(0, 5)
    this.emit()
    setTimeout(() => this.dismiss(notification.id), 4000)
  }

  dismiss(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.emit()
  }
}

export const notificationEngine = new NotificationEngine()
