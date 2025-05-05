import { config } from 'dotenv'

import { DomainEvents } from '@/core/events/domain-events'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

config({
  path: '.env',
  override: true,
})

config({ path: '.env.test', override: true })

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaID)

  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`)

  await prisma.$disconnect()
})
