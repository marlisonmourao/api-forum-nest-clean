import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeNotification } from '@/factories/make-notification'
import { InMemoryNotificationRepository } from '@/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

beforeEach(() => {
  inMemoryNotificationRepository = new InMemoryNotificationRepository()
  sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
})

describe('Read notification use case', () => {
  it('should be able to read an notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationRepository.create(notification)

    await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date)
    )
  })

  it('should not be able to read an notification with wrong recipient', async () => {
    const notification = makeNotification()

    await inMemoryNotificationRepository.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'wrong-recipient-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
