import { PrismaService } from '@/prisma/prisma.service'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { hash } from 'bcryptjs'

@Controller('account')
export class CreateAccountController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handler(
    @Body() body: { name: string; email: string; password: string }
  ) {
    const { name, email, password } = body

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
