import { Either, right } from '@/core/either'
import { AnswerComment } from '@/entities/answer-comment'

import { AnswerCommentRepository } from '../repositories/answer-comment-repository'

interface FetchAnswerCommentUseCaseRequest {
  page: number
  answerId: string
}

type FetchAnswerCommentUseCaseResponse = Either<
  null,
  {
    answerComment: AnswerComment[]
  }
>

export class FetchAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentRepository.findManyByAnswerId(
      answerId,
      {
        page,
      }
    )

    return right({
      answerComment,
    })
  }
}
