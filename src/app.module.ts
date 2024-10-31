import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { UsersModule } from './graphql/users/users.module'
import { AuthModule } from './graphql/auth/auth.module'
import { ConfigService } from '@nestjs/config'
import { User } from './graphql/models/User.entity'
import { ProductModule } from './graphql/product/product.module'
import { Product } from './graphql/models/product.entity'
import { ProductGateway } from './graphql/product/product.gateway'
import { MulterModule } from '@nestjs/platform-express'
import { Cart } from './graphql/models/Cart.entity'
import { CartProduct } from './graphql/models/CartProduct'
import { CartModule } from './graphql/cart/cart.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      host: 'localhost',
      port: 5432,
      username: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      database:
        process.env.NODE_ENV === 'production'
          ? 'nest-grap-pg'
          : process.env.NODE_ENV === 'test'
          ? 'test.sqlite'
          : 'db.sqlite',
      password: 'O9M1a8r5',
      entities: [User, Product, Cart, CartProduct],
      synchronize: true,
      logging: false,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req }) => ({ req, currentUser: req.currentUser }),
      autoSchemaFile: 'src/schema.gql',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    CartModule,
  ],
  controllers: [],
  providers: [ConfigService, ProductGateway],
})
export class AppModule {}
