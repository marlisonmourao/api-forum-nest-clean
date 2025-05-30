import { Module } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisCacheRepository } from './redis-cache-repository'
import { RedisService } from './redis-service'

@Module({
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
