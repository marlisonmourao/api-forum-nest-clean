import type { UseCaseError } from '@/core/errors/use-cases-error'

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(fileType: string) {
    super(`Attachment with type ${fileType} is not allowed.`)
  }
}
