import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { StudentProps } from '@/domain/forum/enterprise/entities/student'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { faker } from '@faker-js/faker'

export function fakeStudent(
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
