import { Slug } from '@/entities/value-objects/slug'
import { makeQuestion } from '@/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository()
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository
  )
  sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
})

describe('Get question by slug use case', () => {
  it('should be able to get an question by slug', async () => {
    const createQuestion = makeQuestion({
      slug: Slug.create('an-example-title'),
    })
    await inMemoryQuestionRepository.create(createQuestion)

    const result = await sut.execute({
      slug: 'an-example-title',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question).toBeTruthy()
      expect(inMemoryQuestionRepository.items[0].id).toEqual(
        result.value.question.id
      )
    }
  })
})
