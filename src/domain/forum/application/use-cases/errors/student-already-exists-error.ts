import type { UseCaseError } from '@/core/errors/use-cases-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student with identifier ${identifier} already exists.`)
  }
}
