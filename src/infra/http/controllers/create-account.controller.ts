import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes
} from '@nestjs/common'

import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>
@Controller('accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: CreateAccountBody) {
    const { name, email, password } = createAccountBodySchema.parse(body)

   const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if(result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
