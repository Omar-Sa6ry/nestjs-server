import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartProduct } from './modules/cart/entity/CartProduct'
import { Cart } from './modules/cart/entity/Cart.entity'
import { Product } from './modules/product/entity/Product.entity'
import { User } from './modules/users/entity/User.entity'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { UsersModule } from './modules/users/users.module'
import { CartModule } from './modules/cart/cart.module'
import { ProductModule } from './modules/product/product.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProductGateway } from './modules/product/services/product.gateway'
import { MulterModule } from '@nestjs/platform-express'
import { OrdersModule } from './modules/orders/orders.module'
import * as dotenv from 'dotenv'
import { OAuthModule } from './modules/users/auth/oauth/oauth.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      host: 'localhost',
      port: 5432,
      username:
        process.env.NODE_ENV === 'production' ? process.env.DB : 'sqlite',
      database:
        process.env.NODE_ENV === 'production'
          ? process.env.DB_NAME
          : process.env.NODE_ENV === 'test'
          ? 'test.sqlite'
          : 'db.sqlite',
      password: process.env.DB_PASSWORD,
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
    ProductModule,
    CartModule,
    OrdersModule,
    OAuthModule,
  ],
  providers: [
    ConfigService,
    ProductGateway,
    {
      provide: 'NODE_CONFIG',
      useFactory: (configService: ConfigService) => {
        dotenv.config()
        return configService
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
