import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)

    return questionComment
  }

  async findById(id: string) {
    const questionComment = this.items.find(item => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentIndex = this.items.findIndex(
      item => item.id.toString() === questionComment.id.toString()
    )

    if (questionCommentIndex >= 0) {
      this.items.splice(questionCommentIndex, 1)
    }
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = this.studentRepository.items.find(student => {
          return comment.authorId.equals(student.id)
        })

        if (!author) {
          throw new Error('Author not found')
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          authorName: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt ?? null,
        })
      })

    return questionComments
  }
}
