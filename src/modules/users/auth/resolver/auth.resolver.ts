import { Resolver, Args, Mutation, Context } from '@nestjs/graphql'
import { CreateUserInput } from 'src/modules/users/dto/CreateUserInput'
import { User } from 'src/modules/users/entity/User.entity'
import { authService } from '../service/auth.service'
import { UseGuards, ValidationPipe } from '@nestjs/common'
import { LoginUserInput } from '../../dto/LoginInput'
import { JwtGuard } from '../../../../guards/jwt.guard'
import { AuthResponse } from '../../dto/Auth.dto'
import { SessionGuard } from 'src/guards/session.guard'
import { GenerateToken } from '../config/GenerateToken'

@Resolver(of => User)
export class AuthResolver {
  constructor (
    private authService: authService,
    private readonly generateToken: GenerateToken,
  ) {}

  @Mutation(returns => AuthResponse)
  async signup (
    @Context('req') req,
    @Args('createUserData', new ValidationPipe())
    createUserData: CreateUserInput,
  ) {
    const user = await this.authService.register(createUserData)
    const token = await this.generateToken.generateToken(user.email)
    req.session.userId = user.id
    req.session.user = user
    return { user, token }
  }

  @Mutation(returns => AuthResponse)
  async login (
    @Args('email') email: string,
    @Args('password') password: string,
    // @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context('req') req,
  ) {
    const loginUserInput = { email, password }
    const user = await this.authService.signin(loginUserInput)
    const token = await this.generateToken.generateToken(user.email)
    req.session.userId = user.id
    req.session.user = user
    return { user, token }
  }

  @Mutation(() => AuthResponse)
  async loginAdmin (
    @Args('loginUserInput', new ValidationPipe())
    loginUserInput: LoginUserInput,
    @Context('req') req,
  ) {
    const user = await this.authService.signinAdmin(loginUserInput)
    const token = await this.generateToken.generateToken(user.email)
    req.session.userId = user.id
    req.session.user = user
    return { user, token }
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

  @UseGuards(JwtGuard, SessionGuard)
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
