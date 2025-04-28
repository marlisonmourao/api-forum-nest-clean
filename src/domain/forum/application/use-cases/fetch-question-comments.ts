import { type Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { QuestionCommentRepository } from '../repositories/question-comment-repository'

interface FetchQuestionCommentsUseCaseRequest {
  page: number
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        }
      )

    return right({
      comments,
    })
  }
}
