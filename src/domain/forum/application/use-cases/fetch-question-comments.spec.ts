import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from '@/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentsUseCase

beforeEach(() => {
  inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
  sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
})

describe('Fetch question questioncomments use case', () => {
  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      })
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments[0].id).toEqual(
      inMemoryQuestionCommentRepository.items[0].id
    )
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch question comments paginated', async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
