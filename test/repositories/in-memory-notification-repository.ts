import type { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async findById(notificationId: string) {
    const notification = this.items.find(
      notification => notification.id.toString() === notificationId
    )

    if (!notification) {
      return null
    }

    return notification
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      item => item.id.toString() === notification.id.toString()
    )

    this.items[notificationIndex] = notification
  }
}
