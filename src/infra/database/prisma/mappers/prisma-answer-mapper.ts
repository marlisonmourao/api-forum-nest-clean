import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    const answer = Answer.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),

        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )

    return answer
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
