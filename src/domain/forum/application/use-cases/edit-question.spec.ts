import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from '@/factories/make-question'
import { makeQuestionAttachment } from '@/factories/make-question-attachment'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachment: InMemoryQuestionAttachmentRepository
let sut: EditQuestionUseCase

beforeEach(() => {
  inMemoryQuestionAttachment = new InMemoryQuestionAttachmentRepository()
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachment
  )
  sut = new EditQuestionUseCase(
    inMemoryQuestionRepository,
    inMemoryQuestionAttachment
  )
})

describe('Edit question use case', () => {
  it('should be able to edit an question', async () => {
    const createQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(createQuestion)

    inMemoryQuestionAttachment.items.push(
      makeQuestionAttachment({
        questionId: createQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: createQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      })
    )

    await sut.execute({
      authorId: createQuestion.authorId.toString(),
      title: 'New question title',
      content: 'New question content',
      questionId: createQuestion.id.toString(),
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'New question title',
      content: 'New question content',
    })

    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems
    ).toHaveLength(2)
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3'),
      }),
    ])
  })

  it('should not be able to delete a question from another author', async () => {
    const createQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(createQuestion)

    const result = await sut.execute({
      authorId: 'another-author-id',
      title: 'New question title',
      content: 'New question content',
      questionId: createQuestion.id.toString(),
      attachmentIds: ['1', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed attachments when editing a question', async () => {
    const createQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(createQuestion)

    inMemoryQuestionAttachment.items.push(
      makeQuestionAttachment({
        questionId: createQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: createQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      })
    )

    await sut.execute({
      authorId: createQuestion.authorId.toString(),
      title: 'New question title',
      content: 'New question content',
      questionId: createQuestion.id.toString(),
      attachmentIds: ['1', '3'],
    })

    expect(inMemoryQuestionAttachment.items).toHaveLength(2)
    expect(inMemoryQuestionAttachment.items[0].attachmentId.toString()).toEqual(
      '1'
    )
    expect(inMemoryQuestionAttachment.items[0].questionId.toString()).toEqual(
      createQuestion.id.toString()
    )

    expect(inMemoryQuestionAttachment.items[1].attachmentId.toString()).toEqual(
      '3'
    )
  })
})
