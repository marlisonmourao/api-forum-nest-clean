import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '@/factories/make-answer-comment'
import { makeStudent } from '@/factories/make-student'
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { FetchAnswerCommentUseCase } from './fetch-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchAnswerCommentUseCase

beforeEach(() => {
  inMemoryStudentRepository = new InMemoryStudentRepository()
  inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
    inMemoryStudentRepository
  )
  sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository)
})

describe('Fetch answer comments use case', () => {
  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(comment1)

    await inMemoryAnswerCommentRepository.create(comment2)

    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)

    await inMemoryAnswerCommentRepository.create(comment1)
    await inMemoryAnswerCommentRepository.create(comment2)
    await inMemoryAnswerCommentRepository.create(comment3)

    const resultAuthor = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(resultAuthor.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment3.id,
        }),
      ])
    )
  })

  it('should be able to fetch answer comments paginated', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentRepository.items.push(student)

    for (let i = 0; i < 22; i++) {
      inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        })
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
