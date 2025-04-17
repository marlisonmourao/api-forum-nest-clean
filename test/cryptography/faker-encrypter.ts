import type { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class FakeEncryptor implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
