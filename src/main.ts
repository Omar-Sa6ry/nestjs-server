import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import * as session from 'express-session'

async function bootstrap () {
  const app = await NestFactory.create(AppModule, {
    cors: true,
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
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }))
  await app.listen(3000)
}

bootstrap()
