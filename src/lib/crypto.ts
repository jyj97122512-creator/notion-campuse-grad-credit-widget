import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGO = 'aes-256-gcm'

function getKey(): Buffer {
  const secret = process.env.CONFIG_SECRET ?? 'credit-buddy-dev-secret-key-32ch'
  return Buffer.from(secret.padEnd(32).slice(0, 32))
}

export function encryptConfig(data: object): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGO, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64url')
}

export function decryptConfig(token: string): Record<string, unknown> {
  const buf = Buffer.from(token, 'base64url')
  const iv = buf.subarray(0, 16)
  const tag = buf.subarray(16, 32)
  const encrypted = buf.subarray(32)
  const decipher = createDecipheriv(ALGO, getKey(), iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return JSON.parse(decrypted.toString('utf8'))
}
