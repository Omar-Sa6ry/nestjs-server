import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql'
import { User } from 'src/graphql/models/User.entity'
import { UserService } from './users.service'
import { ParseIntPipe, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { AdminGuard } from 'src/guards/admin.guard'

@Resolver(of => User)
export class UserResolver {
  constructor (private userService: UserService) {}

  @Query(returns => User, { nullable: true })
  getUserById (@Args('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id)
  }

  @Query(() => [User])
  findByEmail (@Args('email', { type: () => String }) email: string) {
    return this.userService.getUserByEmail(email)
  }

  @Query(() => String)
  async getCurrentUser (@Context('user') user) {
    return `Current user: ${user.username}`
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => User)
  updateEmail (@Args('email') email: string, @Context('req') req) {
    return this.userService.updateUserEmail(email, req.session.userId)
  }

  @UseGuards(AdminGuard)
  @Mutation(returns => String)
  deleteUser (@Args('id') id: string) {
    return this.userService.removeUser(+id)
  }
}
