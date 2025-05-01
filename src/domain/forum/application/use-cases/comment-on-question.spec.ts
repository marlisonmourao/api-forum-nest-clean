import { makeQuestion } from '@/factories/make-question'
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionComment: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

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
  inMemoryQuestionComment = new InMemoryQuestionCommentRepository(
    inMemoryStudentRepository
  )
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
