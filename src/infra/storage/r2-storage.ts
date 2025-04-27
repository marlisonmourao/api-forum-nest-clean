import {
  Uploader,
  UploaderParams,
} from '@/domain/forum/application/storage/uploader'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'node:crypto'
import { Env } from '../env/env'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private configService: ConfigService<Env, true>) {
    const accountId = configService.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload(params: UploaderParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${params.fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        Body: params.body,
        ContentType: params.fileType,
      })
    )

    return {
      url: uniqueFileName,
    }
  }
}
