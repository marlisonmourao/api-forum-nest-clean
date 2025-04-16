import { makeQuestion } from '@/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: FetchRecentQuestionsUseCase

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository()
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository
  )
  sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
})

describe('Fetch recent questions use case', () => {
  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date('2025-01-01') })
    )

    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date('2025-01-02') })
    )

    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date('2025-01-03') })
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.question).toHaveLength(3)

    expect(result.value?.question).toEqual([
      expect.objectContaining({
        createdAt: new Date('2025-01-03'),
      }),
      expect.objectContaining({
        createdAt: new Date('2025-01-02'),
      }),

      expect.objectContaining({
        createdAt: new Date('2025-01-01'),
      }),
    ])
  })

  it('should be able to fetch recent questions paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(
        makeQuestion({ createdAt: new Date(`2025-01-0${i}`) })
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.question).toHaveLength(2)
  })
})
