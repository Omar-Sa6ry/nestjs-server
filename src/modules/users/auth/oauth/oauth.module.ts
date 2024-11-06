import { Module } from '@nestjs/common'
import { OAuthController } from './controller/oauth.controller'
import { GoogleStrategy } from './strategies/google.strategy'
import { OAuthService } from './service/oauth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/users/entity/User.entity'
import { GenerateToken } from 'src/modules/users/auth/config/GenerateToken'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [OAuthController],
  providers: [GoogleStrategy, OAuthService, GenerateToken],
})
export class OAuthModule {}
