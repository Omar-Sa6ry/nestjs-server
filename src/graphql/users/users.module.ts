import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/graphql/models/User.entity'
import { UserService } from './users.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { CurrentUserMiddleware } from 'src/middleware/CurrentUser'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService, AuthGuard],
})
export class UsersModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL })
  }
}
