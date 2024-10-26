import { Module } from '@nestjs/common'
import { Cart } from '../models/Cart.entity'
import { CartResolver } from './cart.resolver'
import { CartService } from './cart.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductService } from '../product/produt.service'
import { Product } from '../models/product.entity'
import { CartProduct } from '../models/CartProduct'
import { ProductGateway } from '../product/product.gateway'
import { AuthGuard } from 'src/guards/auth.guard'
import { User } from '../models/User.entity'
import { UserService } from '../users/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Cart, CartProduct])],
  providers: [
    CartResolver,
    CartService,
    ProductService,
    UserService,
    ProductGateway,
    AuthGuard,
  ],
})
export class CartModule {}
