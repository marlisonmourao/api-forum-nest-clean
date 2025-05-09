import { config } from 'dotenv'

import { DomainEvents } from '@/core/events/domain-events'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { envSchema } from '@/infra/env/env'
import { Redis } from 'ioredis'

config({
  path: '.env',
  override: true,
})

config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaID)

  env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`)

  await prisma.$disconnect()
})
