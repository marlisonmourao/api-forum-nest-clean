import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachment-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswerRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,

    QuestionRepository,
    StudentRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    AttachmentRepository,
  ],
})
export class DatabaseModule {}
