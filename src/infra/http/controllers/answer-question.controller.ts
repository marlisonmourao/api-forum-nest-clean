import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

@Controller('questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handler(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: AnswerQuestionBody,
    @Param('questionId') questionId: string
  ) {
    const { content } = body

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: user.sub,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }
  }
}
