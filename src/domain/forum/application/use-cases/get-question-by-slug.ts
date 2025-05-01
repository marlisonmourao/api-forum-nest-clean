import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
import { QuestionRepository } from '../repositories/question-repository'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
