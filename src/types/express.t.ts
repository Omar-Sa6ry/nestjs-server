// to can use req.user=user in middleware

import * as session from 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId: number
  }
}
