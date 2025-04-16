import type { PaginationParams } from '@/core/repositories/paginations-params'
import type { QuestionComment } from '@/entities/question-comment'

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<QuestionComment>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
