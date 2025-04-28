import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'

import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async create(question: Question): Promise<Question> {
    const data = PrismaQuestionMapper.toPrisma(question)

    const createdQuestion = await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    )

    return PrismaQuestionMapper.toDomain(createdQuestion)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems()
      ),
      this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
    ])
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    })
  }
}
