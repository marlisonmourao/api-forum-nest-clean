import { type Either, right } from '@/core/either'
import { Answer } from '@/entities/answer'
import { Injectable } from '@nestjs/common'
import { AnswerRepository } from '../repositories/answer-repository'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answer: Answer[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answer = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page }
    )

    return right({
      answer,
    })
  }
}
