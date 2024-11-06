import { Expose } from 'class-transformer'
import { Cart } from 'src/modules/cart/entity/Cart.entity'

export class UserDto {
  @Expose()
  id: number

  @Expose()
  username: string

  @Expose()
  email: string

  @Expose()
  carts?: Cart[]
}
