import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '@/entities/answer-comment'

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<AnswerComment>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
