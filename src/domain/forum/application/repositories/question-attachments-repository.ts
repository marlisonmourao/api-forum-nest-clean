import { QuestionAttachment } from '@/entities/question-attachment'

export abstract class QuestionAttachmentRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>

  abstract findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
