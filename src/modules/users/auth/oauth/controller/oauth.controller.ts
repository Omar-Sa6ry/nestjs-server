import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { OAuthService } from '../service/oauth.service'
import { GenerateToken } from 'src/modules/users/auth/config/GenerateToken'

@Controller('api/auth')
export class OAuthController {
  constructor (
    private readonly oauthService: OAuthService,
    private readonly generateToken: GenerateToken,
  ) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleLogin () {
    return { msg: 'Google Authentication' }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback (@Req() req: any, @Res() res: Response) {
    const userObj = req.user as any
    const newUser = {
      userId: userObj.profile.id,
      email: userObj.profile.emails[0].value,
      username: userObj.profile.displayName,
      image: userObj.profile.photos[0].value,
    }
    const user = await this.oauthService.validateUser(newUser)
    await this.generateToken.generateToken(user.email)
    req.session.userId = user.id
    req.session.user = user

    return res.redirect(process.env.MAIN_CLIENT)
  }
}
