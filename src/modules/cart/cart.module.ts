import { Module } from '@nestjs/common'
import { Cart } from './entity/Cart.entity'
import { CartResolver } from './resolver/cart.resolver'
import { CartService } from './services/cart.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '../product/entity/Product.entity'
import { CartProduct } from './entity/CartProduct'
import { ProductGateway } from '../product/services/product.gateway'
import { User } from '../users/entity/User.entity'
import { UserService } from '../users/services/users.service'
import { ProductService } from '../product/services/produt.service'
import { JwtGuard } from '../../guards/jwt.guard'
import { JwtService } from '@nestjs/jwt'
import { SessionGuard } from 'src/guards/session.guard'

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Cart, CartProduct])],
  providers: [
    CartResolver,
    CartService,
    ProductService,
    UserService,
    ProductGateway,
    JwtService,
    JwtGuard,
    SessionGuard,
  ],
})
export class CartModule {}
