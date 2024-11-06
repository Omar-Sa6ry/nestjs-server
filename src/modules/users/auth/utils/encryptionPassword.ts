import { promisify } from 'util'
import { scrypt as _scrypt, randomBytes } from 'crypto'

const scrypt = promisify(_scrypt)

export const encryptionPassword = async (password: string) => {
  const salt = randomBytes(8).toString('hex')
  const hash = (await scrypt(password, salt, 32)) as Buffer
  return salt + '.' + hash.toString('hex')
}
