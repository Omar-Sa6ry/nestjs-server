import { ProductResolver } from './product.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from '../users/users.service'
import { ProductService } from './produt.service'
import { User } from '../models/User.entity'
import { Product } from '../models/product.entity'
import { AdminGuard } from 'src/guards/admin.guard'
import { ProductGateway } from './product.gateway'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([Product, User])],
  providers: [
    ProductResolver,
    ProductService,
    UserService,
    AdminGuard,
    ProductGateway,
  ],
})
export class ProductModule {

}
