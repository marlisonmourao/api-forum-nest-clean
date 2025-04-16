import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = []

  constructor(
    public readonly answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)

    return answer
  }

  async findById(id: string) {
    const answer = this.items.find(item => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async delete(id: string) {
    const itemIndex = this.items.findIndex(item => item.id.toString() === id)

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }

    await this.answerAttachmentRepository.deleteManyByAnswerId(id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex(
      item => item.id.toString() === answer.id.toString()
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = answer
    }

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    const answer = this.items.filter(
      item => item.questionId.toString() === questionId
    )

    return answer.slice((params.page - 1) * 20, params.page * 20)
  }
}
