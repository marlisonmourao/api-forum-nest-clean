import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from '@/factories/make-question'
import { makeQuestionAttachment } from '@/factories/make-question-attachment'
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase

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
  sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
})

describe('Delete question use case', () => {
  it('should be able to delete a question', async () => {
    const createQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(createQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
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
      id: createQuestion.id.toString(),
      authorId: createQuestion.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another author', async () => {
    const createQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(createQuestion)

    const result = await sut.execute({
      id: createQuestion.id.toString(),
      authorId: 'another-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
