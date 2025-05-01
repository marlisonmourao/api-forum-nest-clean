import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentRepository } from './in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from './in-memory-student-repository'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentRepository: InMemoryAttachmentRepository,
    private studentRepository: InMemoryStudentRepository
  ) {}

  async create(question: Question) {
    this.items.push(question)

    this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)

    return question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find(item => item.slug.value === slug)

    if (!question) {
      return null
    }
    return question
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find(item => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = await this.studentRepository.items.find(student =>
      student.id.equals(question.authorId)
    )

    if (!author) {
      throw new Error(`Author not found for question ${question.id}`)
    }

    const questionAttachment = this.questionAttachmentRepository.items.filter(
      questionAttachment => {
        return questionAttachment.questionId.equals(question.id)
      }
    )

    const attachments = questionAttachment.map(attachment => {
      const attachmentFound = this.attachmentRepository.items.find(item =>
        item.id.equals(attachment.attachmentId)
      )

      if (!attachmentFound) {
        throw new Error(`Attachments not found for question ${question.id}`)
      }

      return attachmentFound
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async findById(id: string) {
    const question = this.items.find(item => item.id.toString() === id)
    if (!question) {
      return null
    }
    return question
  }

  async findManyByAuthorId(authorId: string) {
    const questions = this.items.filter(
      item => item.authorId.toString() === authorId
    )
    return questions
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === question.id.toString()
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toValue()
    )
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === question.id.toString()
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = question
    }

    this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems()
    )

    this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent({ page }: PaginationParams) {
    const question = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return question
  }
}
