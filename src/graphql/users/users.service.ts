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

  getUserByEmail (email?: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  getUserById (id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  async getUserByToken (token: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { resetToken: token, resetTokenExpiry: MoreThan(new Date()) },
    })
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
