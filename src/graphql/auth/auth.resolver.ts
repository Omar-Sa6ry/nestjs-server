import { Resolver, Args, Mutation, Context } from '@nestjs/graphql'
import { CreateUserInput } from 'src/dtos/CreateUserInput'
import { User } from 'src/graphql/models/User.entity'
import { authService } from './auth.service'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'

@Resolver(of => User)
export class AuthResolver {
  constructor (private authService: authService) {}

  @Mutation(returns => User)
  async signup (
    @Context('req') req,
    @Args('createUserData') createUserData: CreateUserInput,
  ) {
    const user = await this.authService.register(createUserData)
    req.session.userId = user.id
    return user
  }

  @Mutation(returns => User)
  async login (
    @Args('email') email: string,
    @Args('password') password: string,
    @Context('req') req,
  ) {
    const user = await this.authService.signin(email, password)
    req.session.userID = user.id
    return user
  }

  @Mutation(() => Boolean)
  async requestPasswordReset (@Args('email') email: string) {
    return this.authService.forgotPassword(email)
  }

  @Mutation(() => Boolean)
  async resetPassword (
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async changePassword (
    @Context('req') req,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ) {
    const id: number = req.session.userId
    return this.authService.changePassword(oldPassword, newPassword, id)
  }

  @Mutation(() => Boolean)
  async logout (@Context('req') req): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          reject(false)
        } else {
          resolve(true)
        }
      })
    })
  }
}
