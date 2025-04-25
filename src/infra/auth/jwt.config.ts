import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import type { Env } from '../env/env'

export const getJwtConfig = (
  configService: ConfigService<Env, true>
): JwtModuleOptions => {
  const privateKey = configService.get('JWT_PRIVATE_KEY', { infer: true })
  const publicKey = configService.get('JWT_PUBLIC_KEY', { infer: true })

  return {
    signOptions: { algorithm: 'RS256' },
    privateKey: Buffer.from(privateKey, 'base64'),
    publicKey: Buffer.from(publicKey, 'base64'),
  }
}
