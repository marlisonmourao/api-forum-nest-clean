import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handler(@Body() body: AuthenticateBody) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    const { accessToken } = result.value

    return {
      accessToken,
    }
  }
}
