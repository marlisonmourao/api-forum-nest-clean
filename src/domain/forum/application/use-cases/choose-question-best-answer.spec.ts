import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from '@/factories/make-answer'
import { makeQuestion } from '@/factories/make-question'
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository'
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: ChooseQuestionBestAnswerUseCase

beforeEach(() => {
  inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
  inMemoryAnswerRepository = new InMemoryAnswerRepository(
    inMemoryAnswerAttachmentRepository
  )
  inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
  inMemoryStudentRepository = new InMemoryStudentRepository()

  inMemoryQuestionAttachmentRepository =
    new InMemoryQuestionAttachmentRepository()
  inMemoryQuestionRepository = new InMemoryQuestionRepository(
    inMemoryQuestionAttachmentRepository,
    inMemoryAttachmentRepository,
    inMemoryStudentRepository
  )
  sut = new ChooseQuestionBestAnswerUseCase(
    inMemoryAnswerRepository,
    inMemoryQuestionRepository
  )
})

describe('Choose question best answer use case', () => {
  it(' should be able to choose the question best answer', async () => {
    const createQuestion = makeQuestion()

    const createAnswer = makeAnswer({
      questionId: createQuestion.id,
    })

    await inMemoryQuestionRepository.create(createQuestion)
    await inMemoryAnswerRepository.create(createAnswer)

    await sut.execute({
      answerId: createAnswer.id.toString(),
      authorId: createQuestion.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(
      createAnswer.id
    )
  })

  it('should not be able to choose another user question best answer', async () => {
    const createQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    const createAnswer = makeAnswer({
      questionId: createQuestion.id,
    })

    await inMemoryQuestionRepository.create(createQuestion)
    await inMemoryAnswerRepository.create(createAnswer)

    const result = await sut.execute({
      answerId: createAnswer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
