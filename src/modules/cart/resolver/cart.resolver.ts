import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Cart } from '../entity/Cart.entity'
import { CartService } from '../services/cart.service'
import { ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common'
import { AddProductToCartInput } from '../dto/AddProductToCartInput'
import { JwtGuard } from 'src/guards/jwt.guard'
import { SessionGuard } from 'src/guards/session.guard'

@Resolver(of => Cart)
export class CartResolver {
  constructor (private cartService: CartService) {}

  @UseGuards(JwtGuard, SessionGuard)
  @Mutation(() => Cart)
  async addToCart (
    @Context('req') req,
    @Args('addProductToCartInput', new ValidationPipe())
    addProductToCartInput: AddProductToCartInput,
  ) {
    const owner = req.session.userId
    return this.cartService.add(owner, addProductToCartInput)
  }

  @Mutation(() => Cart, { nullable: true })
  async getCart (@Args('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.find(cartId)
  }

  @UseGuards(JwtGuard, SessionGuard)
  @Mutation(() => Cart)
  async emptyCart (
    @Context('req') req,
    @Args('cartId', ParseIntPipe) cartId: number,
  ) {
    const owner = req.session.userId
    return this.cartService.empty(cartId, owner)
  }
}
