import { makeQuestion } from '@/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryQuestionComment: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

beforeEach(() => {
  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository()
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository
  )
  inMemoryQuestionComment = new InMemoryQuestionCommentRepository()
  sut = new CommentOnQuestionUseCase(
    inMemoryQuestionComment,
    inMemoryQuestionRepository
  )
})

describe('Comment on question use case', () => {
  it(' should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'New comment',
    })

    expect(inMemoryQuestionComment.items[0]).toBeTruthy()
    expect(inMemoryQuestionComment.items[0].content).toEqual('New comment')
  })
})
