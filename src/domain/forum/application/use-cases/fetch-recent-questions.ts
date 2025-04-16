import { type Either, right } from '@/core/either'
import { Question } from '@/entities/question'
import type { QuestionRepository } from '../repositories/question-repository'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    question: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const question = await this.questionRepository.findManyRecent({ page })

    return right({
      question,
    })
  }
}
