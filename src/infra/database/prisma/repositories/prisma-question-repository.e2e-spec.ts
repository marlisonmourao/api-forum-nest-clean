import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { AttachmentFactory } from '@/factories/make-attachment'
import { QuestionFactory } from '@/factories/make-question'
import { QuestionAttachmentFactory } from '@/factories/make-question-attachment'
import { StudentFactory } from '@/factories/make-student'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/redis/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

describe('Prisma Question Repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionRepository: QuestionRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionRepository = moduleRef.get(QuestionRepository)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionRepository.findBySlug(slug)

    await cacheRepository.set(
      `questions:${slug}:details`,
      JSON.stringify(questionDetails)
    )

    const cachedQuestionDetails = await questionRepository.findBySlug(slug)

    expect(cachedQuestionDetails).toEqual(questionDetails)
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    // await cacheRepository.set(
    //   `questions:${slug}:details`,
    //   JSON.stringify({ empty: true })
    // )

    let cached = await cacheRepository.get(`questions:${slug}:details`)

    expect(cached).toBeNull()

    await questionRepository.findDetailsBySlug(slug)

    cached = await cacheRepository.get(`questions:${slug}:details`)

    expect(cached).not.toBeNull()

    if (!cached) {
      throw new Error()
    }

    const questionDetails = await questionRepository.findDetailsBySlug(slug)

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      })
    )
  })

  it('should reset question details cache when the question is updated', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `questions:${slug}:details`,
      JSON.stringify({ empty: true })
    )

    await questionRepository.save(question)

    const cached = await cacheRepository.get(`questions:${slug}:details`)

    expect(cached).toBeNull()
  })
})
