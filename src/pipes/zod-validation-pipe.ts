import {
  type ArgumentMetadata,
  BadRequestException,
  type PipeTransform,
} from '@nestjs/common'
import { ZodError, type ZodSchema } from 'zod'

import { fromError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation error',
          statusCode: 400,
          errors: fromError(error),
        })
      }
    }

    return value
  }
}
