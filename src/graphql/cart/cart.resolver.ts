import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Cart } from '../models/Cart.entity'
import { CartService } from './cart.service'
import { ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from 'src/guards/auth.guard'
import { AddProductToCartInput } from './dto/AddProductToCartInput'

@Resolver(of => Cart)
export class CartResolver {
  constructor (private cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Cart)
  async addToCart (
    @Context('req') req,
    @Args('addProductToCartInput',new ValidationPipe) addProductToCartInput: AddProductToCartInput,
  ) {
    const owner = req.session.userId
    return this.cartService.add(owner, addProductToCartInput)
  }

  @Mutation(() => Cart, { nullable: true })
  async getCart (@Args('cartId',ParseIntPipe) cartId: number) {
    return this.cartService.find(cartId)
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Cart)
  async emptyCart (@Context('req') req, @Args('cartId',ParseIntPipe) cartId: number) {
    const owner = req.session.userId
    return this.cartService.empty(cartId, owner)
  }
}
