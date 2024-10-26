import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard implements CanActivate {

  canActivate (context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext()

    if (ctx.req.session.userId) {
      return true // Check if user is logged in
    } else {
      return false
    }
  }
}
