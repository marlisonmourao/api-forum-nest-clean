import { makeAnswerComment } from '@/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

beforeEach(() => {
  inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
  sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
})

describe('Delete answer comment use case', () => {
  it('should be able to delete an answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'another-author',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
