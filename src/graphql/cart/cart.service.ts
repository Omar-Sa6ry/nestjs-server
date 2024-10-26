import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cart } from '../models/Cart.entity'
import { Repository } from 'typeorm'
import { AddProductToCartInput } from 'src/dtos/AddProductToCartInput'
import { Product } from '../models/product.entity'
import { CartProduct } from '../models/CartProduct'
import { User } from '../models/User.entity'

@Injectable()
export class CartService {
  constructor (
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async add (owner: number, addProductToCartInput: AddProductToCartInput) {
    const { productId, quantity, price } = addProductToCartInput

    // check if product already exists
    const existedProduct = await this.productRepository.findOne({
      where: { id: productId },
    })
    if (!existedProduct) {
      throw new NotFoundException('Product not found')
    }
    const cartTotal = quantity * price

    const cart = new Cart()
    const user = await this.userRepository.findOne({
      where: { id: owner },
    })

    const cartProduct = new CartProduct()
    Object.assign(cartProduct, addProductToCartInput)

    console.log(user.carts)
    if (user.carts === undefined) {
      user.carts = []
    }
    cart.owner = owner
    cart.products = [cartProduct]
    cart.cartTotal = cartTotal
    cart.totalBeforeDiscount = cartTotal

    user.carts.push(cart)
    Object.assign(user, user.carts)

    console.log(user)
    await this.cartProductRepository.save(cartProduct)
    await this.userRepository.save(user)
    console.log(user)
    return this.cartRepository.save(cart)
  }

  find (cartId: number) {
    return this.productRepository.findOne({
      where: { id: cartId },
    })
  }

  async empty (cartId: number, owner: number) {
    const existedCart = await this.cartRepository.findOne({
      where: { id: cartId },
    })
    if (!existedCart) {
      throw new NotFoundException('Cart not found')
    }

    const user = await this.userRepository.findOne({
      where: { id: owner },
    })

    user.carts = []
    existedCart.owner=owner
    existedCart.products = []
    existedCart.cartTotal = 0
    existedCart.totalBeforeDiscount = 0
    await this.userRepository.save(user)
    return this.cartRepository.save(existedCart)
  }
}
