import { JwtAuthGuard } from '@/infra/auth/jwt.auth'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

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
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return {
      questions,
    }
  }
}
