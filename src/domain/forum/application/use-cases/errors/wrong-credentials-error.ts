import type { UseCaseError } from '@/core/errors/use-cases-error'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('The provided credentials are incorrect.')
  }
}
