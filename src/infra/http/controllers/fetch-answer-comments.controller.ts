import { FetchAnswerCommentUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comment'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

@Controller('answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParam,
    @Param('answerId') answerId: string
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }

    const answerComments = result.value.comments

    return {
      comments: answerComments.map(CommentWithAuthorPresenter.toHTTP),
    }
  }
}
