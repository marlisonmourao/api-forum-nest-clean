import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachmentRepository,
  ],
  exports: [
    PrismaService,
    PrismaService,
    PrismaQuestionRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerAttachmentRepository,
  ],
})
export class DatabaseModule {}
