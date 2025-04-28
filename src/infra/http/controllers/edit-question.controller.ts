import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>

@Controller('questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handler(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditQuestionBody,
    @Param('id')
    questionId: string
  ) {
    const { title, content, attachments } = body

    const result = await this.editQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentIds: attachments,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }
  }
}
