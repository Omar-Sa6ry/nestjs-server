import { Repository } from 'typeorm'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/modules/users/entity/User.entity'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor (
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async canActivate (context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext()
    const userId = ctx.req.session.userId

    const user = await this.userRepository.findOne({ where: { id: userId } })
    return user && user.admin === true // Check if user is admin
  }
}
