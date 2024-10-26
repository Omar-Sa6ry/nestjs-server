import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { User } from 'src/graphql/models/User.entity'
import { UserService } from 'src/graphql/users/users.service'

declare global {
  namespace Express {
    interface Request {
      currentUser?: User
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor (private usersService: UserService) {}

  async use (req: Request, res: Response, next: NextFunction) {
    const userId = req.session?.userId
    if (userId) {
      const user = await this.usersService.getUserById(userId)
      req.currentUser = user
    }
    next()
  }
}
