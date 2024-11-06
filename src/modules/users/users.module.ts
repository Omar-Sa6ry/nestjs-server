import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/User.entity'
import { UserResolver } from './resolver/user.resolver'
import { AuthResolver } from './auth/resolver/auth.resolver'
import { UserService } from './services/users.service'
import { JwtGuard } from '../../guards/jwt.guard'
import { SentEmail } from './auth/utils/sentEmail'
import { authService } from './auth/service/auth.service'
import { CurrentUserMiddleware } from './auth/middleware/CurrentUser'
import { RoleGuard } from '../../guards/role.guard'
import { SessionGuard } from 'src/guards/session.guard'
import { GenerateToken } from './auth/config/GenerateToken'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'huigyufutftydty',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    UserResolver,
    AuthResolver,
    UserService,
    authService,
    SentEmail,
    GenerateToken,
    RoleGuard,
    JwtGuard,
    SessionGuard,
    JwtService,
  ],
})
export class UsersModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL })
  }
}
