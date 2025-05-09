import { Env } from '@/infra/env/env'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(configService: ConfigService<Env, true>) {
    super({
      host: configService.get('REDIS_HOST', { infer: true }),
      port: configService.get('REDIS_PORT', { infer: true }),
      db: configService.get('REDIS_DB', { infer: true }),
    })
  }

  async onModuleDestroy() {
    await this.disconnect()
  }
}
