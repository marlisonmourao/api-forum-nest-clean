import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '@/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<QuestionComment>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
