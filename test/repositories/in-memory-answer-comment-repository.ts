import type { PaginationParams } from '@/core/repositories/paginations-params'
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

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
}
