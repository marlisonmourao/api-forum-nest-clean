import type { Student } from '@/entities/student'

export abstract class StudentRepository {
  abstract create(student: Student): Promise<Student>
  abstract findByEmail(email: string): Promise<Student | null>
}
