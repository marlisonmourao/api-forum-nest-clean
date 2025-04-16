import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '@/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository'
import { FetchAnswerCommentUseCase } from './fetch-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentUseCase

beforeEach(() => {
  inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
  sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository)
})

describe('Fetch answer comments use case', () => {
  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      })
    )

    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      })
    )

    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      })
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComment[0].id).toEqual(
      inMemoryAnswerCommentRepository.items[0].id
    )
    expect(result.value?.answerComment).toHaveLength(3)
  })

  it('should be able to fetch answer comments paginated', async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        })
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComment).toHaveLength(2)
  })
})
