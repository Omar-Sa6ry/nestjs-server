import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql'
import { User } from 'src/modules/users/entity/User.entity'
import { UserService } from '../services/users.service'
import { ParseIntPipe, UseGuards } from '@nestjs/common'
import { RoleGuard } from '../../../guards/role.guard'
import { JwtGuard } from '../../../guards/jwt.guard'
import { UserDto } from '../dto/User.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { SessionGuard } from 'src/guards/session.guard'

@Resolver(of => User)
export class UserResolver {
  constructor (private userService: UserService) {}

  @UseGuards(JwtGuard, SessionGuard)
  @Serialize(UserDto)
  @Query(returns => User, { nullable: true })
  getUserById (@Args('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id)
  }

  @Query(() => [User])
  @Serialize(UserDto)
  findByEmail (@Args('email', { type: () => String }) email: string) {
    return this.userService.getUserByEmail(email)
  }

  @Query(() => String)
  async getCurrentUser (@Context('user') user) {
    return `Current user: ${user.username}`
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Serialize(UserDto)
  @Mutation(returns => User)
  updateRole (@Args('email') email: string) {
    return this.userService.updateUserRole(email)
  }

  @UseGuards(JwtGuard, SessionGuard)
  @Mutation(returns => User)
  @Serialize(UserDto)
  updateEmail (@Args('email') email: string, @Context('req') req) {
    return this.userService.updateUserEmail(email, req.session.userId)
  }

  @UseGuards(JwtGuard, SessionGuard, RoleGuard)
  @Mutation(returns => String)
  deleteUser (@Args('id') id: string) {
    return this.userService.removeUser(+id)
  }
}
