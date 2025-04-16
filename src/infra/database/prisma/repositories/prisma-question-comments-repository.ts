import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentRepository
{
  create(questionComment: QuestionComment): Promise<QuestionComment> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }
  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
