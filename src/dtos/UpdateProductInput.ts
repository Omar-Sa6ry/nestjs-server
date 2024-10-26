import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  quantity?: number

  @Field({ nullable: true })
  price?: number
}
