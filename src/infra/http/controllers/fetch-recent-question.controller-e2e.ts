import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import request from 'supertest'

describe('Fetch Recents Questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe2@email.com',
        password: await hash('12345678', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question Title 1',
          content: 'Question Content 1',
          authorId: user.id,
          slug: 'question-title-1',
        },
        {
          title: 'Question Title 2',
          content: 'Question Content 2',
          authorId: user.id,
          slug: 'question-title-2',
        },
        {
          title: 'Question Title 3',
          content: 'Question Content 3',
          authorId: user.id,
          slug: 'question-title-3',
        },
        {
          title: 'Question Title 4',
          content: 'Question Content 4',
          authorId: user.id,
          slug: 'question-title-4',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')

      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 1' }),
        expect.objectContaining({ title: 'Question 2' }),
        expect.objectContaining({ title: 'Question 3' }),
        expect.objectContaining({ title: 'Question 4' }),
      ],
    })
  })
})
