import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/modules/users/entity/User.entity'
import { Repository } from 'typeorm'

type UserData = {
  userId: string
  email: string
  username: string
  image: string
}

@Injectable()
export class OAuthService {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async validateUser (userData: UserData): Promise<any> {
    console.time('AuthService')
    const user = await this.userRepository.findOne({
      where: { email: userData.email },
    })

    console.timeEnd('AuthService')
    if (user) {
      return user
    }
    console.log('User not found. Creating...')
    const newUser = await this.userRepository.create({
      email: userData.email,
      // is: userData.userId,
      carts: [],
      username: userData.username,
    })
    return this.userRepository.save(newUser)
  }
}
