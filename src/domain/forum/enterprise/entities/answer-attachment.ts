import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  title: string
  url: string
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachment(props, id)

    return answerAttachment
  }
}
