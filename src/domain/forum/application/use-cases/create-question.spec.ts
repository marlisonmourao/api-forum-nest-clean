import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: CreateQuestionUseCase

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository()
  inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
  inMemoryStudentRepository = new InMemoryStudentRepository()
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
    inMemoryAttachmentRepository,
    inMemoryStudentRepository
  )
  sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
})

describe('Create an question use case', () => {
  it('should be able to create an question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'This is a question',
      content: 'This is a question content',
      attachmentIds: ['attachment-1', 'attachment-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question).toBeTruthy()

    expect(inMemoryQuestionRepository.items[0].id).toEqual(
      result.value?.question.id
    )
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems
    ).toHaveLength(2)
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    ])
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'This is a question',
      content: 'This is a question content',
      attachmentIds: ['attachment-1', 'attachment-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question).toBeTruthy()

    expect(
      inMemoryQuestionAttachmentRepository.items[0].questionId.toString()
    ).toEqual(inMemoryQuestionRepository.items[0].id.toString())
    expect(
      inMemoryQuestionAttachmentRepository.items[1].questionId.toString()
    ).toEqual(inMemoryQuestionRepository.items[0].id.toString())

    expect(
      inMemoryQuestionAttachmentRepository.items[0].attachmentId.toString()
    ).toEqual('attachment-1')
  })
})
