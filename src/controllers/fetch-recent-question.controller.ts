import { JwtAuthGuard } from '@/auth/jwt.auth'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handler(@Query('page', queryValidationPipe) page: PageQueryParam) {
    const perPage = 1

    const question = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return {
      question,
    }
  }
}
