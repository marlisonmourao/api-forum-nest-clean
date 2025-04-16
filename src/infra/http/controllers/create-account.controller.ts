import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'

import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>
@Controller('account')
export class CreateAccountController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: CreateAccountBody) {
    const { name, email, password } = createAccountBodySchema.parse(body)

    const userSameEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (userSameEmail) {
      throw new BadRequestException('User already exists')
    }

    const hashedPassword = await hash(password, 8)

    await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
