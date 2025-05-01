import { makeQuestion } from '@/factories/make-question'
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: FetchRecentQuestionsUseCase

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
