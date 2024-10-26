import { BadRequestException } from '@nestjs/common'
import { promisify } from 'util'
import { scrypt as _scrypt } from 'crypto'

const scrypt = promisify(_scrypt)

export const comparePassword = async (
  userPassword: string,
  password: string,
) => {
  const [salt, storedHash] = userPassword.split('.')
  const hash = (await scrypt(password, salt, 32)) as Buffer
  if (storedHash !== hash.toString('hex')) {
    throw new BadRequestException('Password is incorrect')
  }
}
