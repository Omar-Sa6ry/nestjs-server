import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class AddProductToCartInput {
  @Field()
  productId: number

  @Field()
  price: number

  @Field()
  quantity: number
}
