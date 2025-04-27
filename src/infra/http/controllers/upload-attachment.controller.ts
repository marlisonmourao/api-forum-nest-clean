import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handler(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }), // 3MB
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      body: file.buffer,
      fileType: file.mimetype,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return {
      attachmentId: result.value.attachment.id.toString(),
    }
  }
}
