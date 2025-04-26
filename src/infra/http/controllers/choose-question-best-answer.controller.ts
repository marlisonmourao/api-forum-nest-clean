import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerAnswerController {
  constructor(
    private chooseQuestionBestAnswerAnswer: ChooseQuestionBestAnswerUseCase
  ) {}

  @Patch()
  @HttpCode(204)
  async handler(
    @CurrentUser() user: UserPayload,
    @Param('answerId')
    answerId: string
  ) {
    const result = await this.chooseQuestionBestAnswerAnswer.execute({
      authorId: user.sub,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
