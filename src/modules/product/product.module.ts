import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entity/Product.entity'
import { User } from '../users/entity/User.entity'
import { ProductResolver } from './resolver/product.resolver'
import { UserService } from '../users/services/users.service'
import { ProductGateway } from './services/product.gateway'
import { ProductService } from '../product/services/produt.service'
import { RoleGuard } from '../../guards/role.guard'
import { JwtGuard } from 'src/guards/jwt.guard'
import { SessionGuard } from 'src/guards/session.guard'
import { FileService } from '../file/services/file.service'
import { FileModule } from '../file/file.module'

@Module({
  imports: [TypeOrmModule.forFeature([Product, User]), FileModule],
  providers: [
    ProductResolver,
    ProductService,
    UserService,
    FileService,
    RoleGuard,
    JwtGuard,
    SessionGuard,
    ProductGateway,
  ],
})
export class ProductModule {}
