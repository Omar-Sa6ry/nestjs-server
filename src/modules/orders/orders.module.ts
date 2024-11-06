import { Module } from '@nestjs/common'
import { OrdersService } from './services/orders.service'
import { OrdersResolver } from './resolver/orders.resolver'
import { JwtGuard } from 'src/guards/jwt.guard'
import { SessionGuard } from 'src/guards/session.guard'

@Module({
  providers: [OrdersService, OrdersResolver, JwtGuard, SessionGuard],
})
export class OrdersModule {}
