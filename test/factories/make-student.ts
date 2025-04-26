import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { StudentProps } from '@/domain/forum/enterprise/entities/student'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeStudent(
  override?: Partial<StudentProps>,
  id?: UniqueEntityID
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(student),
    })

    return student
  }
}
