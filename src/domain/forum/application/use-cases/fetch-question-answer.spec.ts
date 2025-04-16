import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '@/factories/make-answer'
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswersUseCase

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository
  )
  sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository)
})

describe('Fetch question answers use case', () => {
  it('should be able to fetch recent answers', async () => {
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer[0].id).toEqual(
      inMemoryAnswerRepository.items[0].id
    )
    expect(result.value?.answer).toHaveLength(3)
  })

  it('should be able to fetch question answers paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer).toHaveLength(2)
  })
})
