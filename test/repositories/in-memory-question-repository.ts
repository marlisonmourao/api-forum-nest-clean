import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: QuestionAttachmentRepository
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
