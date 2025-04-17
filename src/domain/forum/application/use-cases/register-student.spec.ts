import { FakerHash } from '@/cryptography/faker-hasher'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakerHasher: FakerHash
let sut: RegisterStudentUseCase

beforeEach(() => {
  inMemoryStudentRepository = new InMemoryStudentRepository()
  fakerHasher = new FakerHash()

  sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakerHasher)
})

describe('Register student use case', () => {
  it('should be able to register student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.student).toBeTruthy()
    }
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.student.password).toEqual('123456hashed')
    }
  })
})
