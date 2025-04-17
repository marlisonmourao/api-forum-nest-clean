import type { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import type { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class FakerHash implements HashComparer, HashGenerator {
  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain.concat('hashed') === hashed
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('hashed')
  }
}
