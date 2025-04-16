import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '@/factories/make-answer'
import { makeAnswerAttachment } from '@/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { DeleteAnswerUseCase } from './delete-answer'

let inMemoryAnswerAttachment: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: DeleteAnswerUseCase

beforeEach(() => {
  inMemoryAnswerAttachment = new InMemoryAnswerAttachmentRepository()
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachment
  )
  sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
})

describe('Delete answer use case', () => {
  it('should be able to delete an answer', async () => {
    const createAnswer = makeAnswer()

    await inMemoryAnswerRepository.create(createAnswer)

    inMemoryAnswerAttachment.items.push(
      makeAnswerAttachment({
        answerId: createAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: createAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      })
    )

    await sut.execute({
      id: createAnswer.id.toString(),
      authorId: createAnswer.authorId.toString(),
    })

    expect(inMemoryAnswerRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachment.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another author', async () => {
    const createAnswer = makeAnswer()

    await inMemoryAnswerRepository.create(createAnswer)

    const result = await sut.execute({
      id: createAnswer.id.toString(),
      authorId: 'another-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
