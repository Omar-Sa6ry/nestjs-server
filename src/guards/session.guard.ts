import { GqlExecutionContext } from '@nestjs/graphql'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate (context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const request = ctx.req

    if (request.session && request.session.userId) {
      return true // User is logged in
    } else {
      throw new UnauthorizedException('You should login again')
    }
  }
}
