import { makeQuestionComment } from '@/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

beforeEach(() => {
  inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
  sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
})

describe('Delete question comment use case', () => {
  it('should be able to delete an question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentRepository.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'another-author',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
