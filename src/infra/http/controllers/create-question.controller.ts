import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt.auth'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handler(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: CreateQuestionBody
  ) {
    const { title, content } = body

    const convertSlug = this.convertToSlug(title)

    const question = await this.prisma.question.create({
      data: {
        title,
        content,
        authorId: user.sub,
        slug: convertSlug,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace('/[\u0300-\u036f]/g', '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
