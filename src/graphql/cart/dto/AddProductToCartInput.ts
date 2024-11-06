import { InputType, Field } from '@nestjs/graphql'
import { IsInt } from 'class-validator'

@InputType()
export class AddProductToCartInput {
  @IsInt()
  @Field()
  productId: number

  @Field()
  @IsInt()
  price: number

  @Field()
  @IsInt()
  quantity: number
}
