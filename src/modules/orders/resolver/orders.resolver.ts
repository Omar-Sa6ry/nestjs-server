import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { OrderDataDto } from '../dtos/OrderData.dto'
import { OrdersService } from '../services/orders.service'
import { StripeCheckoutSession } from '../entity/Strip.entity'
import { UseGuards } from '@nestjs/common'
import { JwtGuard } from 'src/guards/jwt.guard'
import { SessionGuard } from 'src/guards/session.guard'

@Resolver()
export class OrdersResolver {
  constructor (private readonly ordersService: OrdersService) {}

  @UseGuards(JwtGuard, SessionGuard)
  @Mutation(() => StripeCheckoutSession)
  async createStripeSession (@Args('orderData') orderData: OrderDataDto) {
    return await this.ordersService.createStripe(orderData)
  }
}
