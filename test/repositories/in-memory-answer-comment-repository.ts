import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)

    return answerComment
  }

  async findById(id: string) {
    const answerComment = this.items.find(item => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    const { page } = params

    const start = (page - 1) * 20
    const end = page * 20

    return this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice(start, end)
  }

  async delete(answerComment: AnswerComment) {
    const answerCommentIndex = this.items.findIndex(
      item => item.id.toString() === answerComment.id.toString()
    )

    if (answerCommentIndex >= 0) {
      this.items.splice(answerCommentIndex, 1)
    }
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams
  ) {
    const questionComments = this.items
      .filter(item => item.answerId.toString() === answerId)
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
