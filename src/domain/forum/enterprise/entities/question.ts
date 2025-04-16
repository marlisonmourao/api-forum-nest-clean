import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionBestAnswerChoseEvent } from '../events/question-best-answer-chosen-event'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityID
  slug: Slug
  bestAnswerId?: UniqueEntityID | null
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get slug() {
    return this.props.slug
  }

  get bestAnswerId(): UniqueEntityID | undefined | null {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if (bestAnswerId === undefined) {
      return
    }

    const isChangingBestAnswer =
      this.props.bestAnswerId === null ||
      this.props.bestAnswerId === undefined ||
      (this.props.bestAnswerId &&
        bestAnswerId &&
        !this.props.bestAnswerId.equals(bestAnswerId))

    if (isChangingBestAnswer && bestAnswerId !== null) {
      this.addDomainEvent(new QuestionBestAnswerChoseEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return question
  }
}
