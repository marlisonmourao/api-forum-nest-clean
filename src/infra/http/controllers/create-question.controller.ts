import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handler(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: CreateQuestionBody
  ) {
    const { title, content, attachments } = body

    const result = await this.createQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value)
    }
  }
}
