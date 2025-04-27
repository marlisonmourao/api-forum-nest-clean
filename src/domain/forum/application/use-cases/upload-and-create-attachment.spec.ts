import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository'
import { FakerUploader } from '@/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakerUploader: FakerUploader
let sut: UploadAndCreateAttachmentUseCase

beforeEach(() => {
  inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
  fakerUploader = new FakerUploader()
  sut = new UploadAndCreateAttachmentUseCase(
    inMemoryAttachmentRepository,
    fakerUploader
  )
})

describe('Upload and create attachment use case', async () => {
  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'any_file_name',
      body: Buffer.from('any_file'),
      fileType: 'image/png',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    })

    expect(fakerUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'any_file_name',
      })
    )
  })

  it('should not be able to upload and create an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'any_file_name',
      body: Buffer.from('any_file'),
      fileType: 'invalid/file-type',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
