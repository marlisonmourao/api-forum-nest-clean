import { Slug } from '@/entities/value-objects/slug'
import { makeAttachment } from '@/factories/make-attachment'
import { makeQuestion } from '@/factories/make-question'
import { makeQuestionAttachment } from '@/factories/make-question-attachment'
import { makeStudent } from '@/factories/make-student'
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

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
  sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
})

describe('Get question by slug use case', () => {
  it('should be able to get an question by slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentRepository.items.push(student)

    const createQuestion = makeQuestion({
      slug: Slug.create('an-example-title'),
      authorId: student.id,
    })

    await inMemoryQuestionRepository.create(createQuestion)

    const attachment = makeAttachment({
      title: 'Some attachment title',
    })

    inMemoryAttachmentRepository.items.push(attachment)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: createQuestion.id,
        attachmentId: attachment.id,
      })
    )

    const result = await sut.execute({
      slug: 'an-example-title',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question).toBeTruthy()
      expect(result.value.question.authorId).toEqual(student.id)
      expect(result.value.question.author).toBe('John Doe')
      expect(result.value.question.attachments).toHaveLength(1)
      expect(result.value.question.attachments[0].title).toBe(
        'Some attachment title'
      )
    }
  })
})
