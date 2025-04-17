import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import type { Env } from '../env'
import { JwtStrategy } from './jwt-strategy'
import { getJwtConfig } from './jwt.config'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => {
        return getJwtConfig(configService)
      },
    }),
    PassportModule,
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
