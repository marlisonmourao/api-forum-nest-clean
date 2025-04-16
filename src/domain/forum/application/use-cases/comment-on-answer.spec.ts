import { makeAnswer } from '@/factories/make-answer'
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerComment: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository
  )
  inMemoryAnswerComment = new InMemoryAnswerCommentRepository()
  sut = new CommentOnAnswerUseCase(
    inMemoryAnswerComment,
    inMemoryAnswerRepository
  )
})

describe('Comment on answer use case', () => {
  it(' should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'New comment',
    })

    expect(inMemoryAnswerComment.items[0]).toBeTruthy()
    expect(inMemoryAnswerComment.items[0].content).toEqual('New comment')
  })
})
