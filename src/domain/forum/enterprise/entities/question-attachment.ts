import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  title: string
  url: string
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachment(props, id)

    return questionAttachment
  }
}
