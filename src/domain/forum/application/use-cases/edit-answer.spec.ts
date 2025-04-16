import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '@/factories/make-answer'
import { makeAnswerAttachment } from '@/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswerAttachments: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

beforeEach(() => {
  inMemoryAnswerAttachments = new InMemoryAnswerAttachmentRepository()
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachments
  )
  sut = new EditAnswerUseCase(
    inMemoryAnswerRepository,
    inMemoryAnswerAttachments
  )
})

describe('Edit answer use case', () => {
  it('should be able to edit an answer', async () => {
    const createAnswer = makeAnswer()

    await inMemoryAnswerRepository.create(createAnswer)

    inMemoryAnswerAttachments.items.push(
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
      authorId: createAnswer.authorId.toString(),
      content: 'New answer content',
      answerId: createAnswer.id.toString(),
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'New answer content',
    })

    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ])
  })

  it('should not be able to delete a answer from another author', async () => {
    const createAnswer = makeAnswer()

    await inMemoryAnswerRepository.create(createAnswer)

    const result = await sut.execute({
      authorId: 'another-author-id',
      content: 'New answer content',
      answerId: createAnswer.id.toString(),
      attachmentIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
