import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryNotificationRepository } from '@/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

beforeEach(() => {
  inMemoryNotificationRepository = new InMemoryNotificationRepository()
  sut = new SendNotificationUseCase(inMemoryNotificationRepository)
})

describe('Create notification use case', () => {
  it('should be able to send an notification', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityID('recipient-1'),
      title: 'This is a notification',
      content: 'This is a notification content',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notification).toBeTruthy()

    expect(inMemoryNotificationRepository.items[0].id).toEqual(
      result.value?.notification.id
    )
    expect(inMemoryNotificationRepository.items[0].recipientId).toEqual(
      new UniqueEntityID('recipient-1')
    )
  })
})
