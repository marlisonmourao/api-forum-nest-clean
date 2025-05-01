import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '@/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<AnswerComment>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findManyByAnswerIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>
}
