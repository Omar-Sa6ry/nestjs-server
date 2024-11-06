import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { User } from 'src/modules/users/entity/User.entity'
import { UserService } from 'src/modules/users/services/users.service'

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

      if (!(user instanceof NotFoundException)) {
        req.currentUser = user as User
      } else {
        req.currentUser = null
      }
    }
    next()
  }
}
