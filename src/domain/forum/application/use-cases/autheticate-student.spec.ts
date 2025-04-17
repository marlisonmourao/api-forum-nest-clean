import { FakeEncryptor } from '@/cryptography/faker-encrypter'
import { FakerHash } from '@/cryptography/faker-hasher'
import { fakeStudent } from '@/factories/make-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository'
import { AuthenticateStudentUseCase } from './authenticate-user'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakerHasher: FakerHash
let fakerEncrypter: FakeEncryptor
let sut: AuthenticateStudentUseCase

beforeEach(() => {
  inMemoryStudentRepository = new InMemoryStudentRepository()
  fakerEncrypter = new FakeEncryptor()
  fakerHasher = new FakerHash()

  sut = new AuthenticateStudentUseCase(
    inMemoryStudentRepository,
    fakerHasher,
    fakerEncrypter
  )
})

describe('Authenticate student use case', () => {
  it('should be able to authenticate student', async () => {
    const student = fakeStudent({
      email: 'john@email.com',
      password: await fakerHasher.hash('123456'),
    })

    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: 'john@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
