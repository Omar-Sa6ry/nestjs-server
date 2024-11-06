import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor (private jwtService: JwtService) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()
    const request = ctx.req

    // Token extraction
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('No token found')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      // Assign payload to request object
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('Invalid token')
    }

    return true
  }

  extractTokenFromHeader (request: Request): string | null {
    const [type, token] = request.headers['authorization']?.split(' ') ?? []
    return type === 'Bearer' ? token : null
  }
}
