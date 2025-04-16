import type { PaginationParams } from '@/core/repositories/paginations-params'
import type { Answer } from '@/entities/answer'

export abstract class AnswerRepository {
  abstract create(answer: Answer): Promise<Answer>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>
  abstract findById(id: string): Promise<Answer | null>
  abstract delete(id: string): Promise<void>
  abstract save(answer: Answer): Promise<void>
}
