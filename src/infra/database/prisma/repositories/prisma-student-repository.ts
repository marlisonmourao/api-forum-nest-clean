import type { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import type { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaUserMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private prisma: PrismaService) {}

  async create(student: Student): Promise<Student> {
    const data = PrismaUserMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })

    return student
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaUserMapper.toDomain(student)
  }
}
