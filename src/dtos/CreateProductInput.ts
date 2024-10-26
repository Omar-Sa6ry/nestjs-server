import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateProductInput {
  @Field()
  title: string

  @Field()
  category: string

  @Field()
  description: string

  @Field()
  quantity: number

  @Field()
  price: number
}
