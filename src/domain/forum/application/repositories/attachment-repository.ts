import { Attachment } from '../../enterprise/entities/attachments'

export abstract class AttachmentRepository {
  abstract create(attachment: Attachment): Promise<void>
}
