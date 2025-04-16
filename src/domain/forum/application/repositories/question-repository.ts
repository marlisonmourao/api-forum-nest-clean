import type { PaginationParams } from '@/core/repositories/paginations-params'
import type { Question } from '@/entities/question'

export abstract class QuestionRepository {
  abstract create(question: Question): Promise<Question>
  abstract save(question: Question): Promise<Question>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract delete(id: string): Promise<void>
}
