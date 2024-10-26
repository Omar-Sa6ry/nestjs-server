import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/graphql/models/User.entity'
import { authService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { SentEmail } from 'src/utils/sentEmail'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthResolver, authService, SentEmail],
})
export class AuthModule {}
