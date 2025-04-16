import { JwtAuthGuard } from '@/auth/jwt.auth'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('question')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handler(@Body() body: CreateQuestionBody) {
    return 'ok'
  }
}
