import { type Either, right } from '@/core/either'
import type { QuestionComment } from '@/entities/question-comment'
import type { QuestionCommentRepository } from '../repositories/question-comment-repository'

interface FetchQuestionQuestionsUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionQuestionsUseCaseResponse = Either<
  null,
  {
    question: QuestionComment[]
  }
>

export class FetchQuestionQuestionsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionQuestionsUseCaseRequest): Promise<FetchQuestionQuestionsUseCaseResponse> {
    const question = await this.questionCommentRepository.findManyByQuestionId(
      questionId,
      { page }
    )

    return right({
      question,
    })
  }
}
