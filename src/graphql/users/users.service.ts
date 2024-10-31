import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MoreThan, Repository } from 'typeorm'
import { User } from '../models/User.entity'

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserByEmail (email?: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (user === null) {
      return new NotFoundException(`User with ${email} not found`)
    }
    return user
  }

  async getUserById (id: number) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (user === null) {
      return new NotFoundException(`User ${id} not found`)
    }
    return user
  }

  async getUserByToken (token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { resetToken: token, resetTokenExpiry: MoreThan(new Date()) },
    })
    if (!user) {
      new NotFoundException(`User with this is (${token}) not found`)
    }
    return user
  }

  async updateUserEmail (email: string, id: number) {
    const existingUserById = await this.userRepository.findOne({
      where: { id },
    })
    if (!existingUserById) {
      throw new BadRequestException('User not found')
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    })
    if (existingUserByEmail) {
      throw new BadRequestException('Email in use, try another email')
    }

    existingUserById.email = email
    return this.userRepository.save(existingUserById)
  }

  async removeUser (id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    await this.userRepository.remove(user)
    return `User with id ${id} successfully deleted`
  }
}
