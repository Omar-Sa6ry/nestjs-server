import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as session from 'express-session'

async function bootstrap () {
  // const app = await NestFactory.create(AppModule, { cors: true })
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
})

  app.useGlobalPipes(new ValidationPipe()) // === (run in app module)
  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set secure: true in production
    }),
  )

  await app.listen(3000)
}

bootstrap()
