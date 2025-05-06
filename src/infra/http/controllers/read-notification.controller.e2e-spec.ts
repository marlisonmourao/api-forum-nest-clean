import { NotificationFactory } from '@/factories/make-notification'
import { QuestionFactory } from '@/factories/make-question'
import { StudentFactory } from '@/factories/make-student'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'

describe('Read Notification (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let prisma: PrismaService
  let notificationFactory: NotificationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
