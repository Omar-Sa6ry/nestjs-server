import { InjectRepository } from '@nestjs/typeorm'
import { MoreThan, Repository } from 'typeorm'
import { User } from '../../entity/User.entity'
import { randomBytes } from 'crypto'
import { CreateUserInput } from 'src/modules/users/dto/CreateUserInput'
import { comparePassword } from '../utils/comparePassword'
import { encryptionPassword } from '../utils/encryptionPassword'
import { SentEmail } from '../utils/sentEmail'
import { LoginUserInput } from '../../dto/LoginInput'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class authService {
  constructor (
    @InjectRepository(User) private usersRepository: Repository<User>,
     private readonly sentEmail: SentEmail,
  ) {}

  async register (createUserData: CreateUserInput) {
    const { username, email, password } = createUserData
    const created = await this.usersRepository.find({ where: { email } })
    if (created.length > 0) {
      throw new BadRequestException('Email in use ,Try anthor Email')
    }

    const result: string = await encryptionPassword(password)
    const user = await this.usersRepository.create({
      username,
      email,
      password: result,
      carts: [],
    })

    await this.sentEmail.sendMail(
      email,
      'Register in App',
      `you registered successfully in the App`,
    )
    await this.usersRepository.save(user)
    return user
  }

  async signin (loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput
    const [user] = await this.usersRepository.find({ where: { email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    await comparePassword(user.password, password)
    return user
  }

  async signinAdmin (loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput
    const [user] = await this.usersRepository.find({ where: { email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.admin) {
      throw new BadRequestException('User is not admin')
    }
    await comparePassword(user.password, password)
    return user
  }

  async forgotPassword (email: string) {
    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.admin) {
      throw new BadRequestException('User is admin ,you cannot edit this user')
    }

    const token = randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpiry = new Date(Date.now() + 900000) // Token valid for 15 minutes
    await this.usersRepository.save(user)

    const resetLink = `http://localhost:3000/grapql/reset-password?token=${token}`
    await this.sentEmail.sendMail(
      email,
      'Password Reset Request',
      `To reset your password, please click the following link: ${resetLink}`,
    )

    return true
  }

  async resetPassword (token: string, newPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { resetToken: token, resetTokenExpiry: MoreThan(new Date()) },
    })
    if (!user) {
      throw new BadRequestException('Invalid or expired token')
    }

    if (user.admin) {
      throw new BadRequestException('User is admin ,you cannot edit this user')
    }

    const password: string = await encryptionPassword(newPassword)
    user.password = password
    user.resetToken = null
    user.resetTokenExpiry = null
    await this.usersRepository.save(user)

    return true
  }

  async changePassword (oldPassword: string, newPassword: string, id: number) {
    const user = await this.usersRepository.findOne({ where: { id } })
    if (user.admin) {
      throw new BadRequestException('User is admin ,you cannot edit this user')
    }

    await comparePassword(user.password, oldPassword)
    if (oldPassword === newPassword) {
      throw new BadRequestException('Change The new password')
    }

    const password = await encryptionPassword(newPassword)
    user.password = password
    await this.usersRepository.save(user)
    return 'Passwords changed successfully'
  }
}
