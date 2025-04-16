import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<Answer> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })

    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id,
      },
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.update({
      where: {
        id: answer.id.toString(),
      },
      data,
    })
  }
}
