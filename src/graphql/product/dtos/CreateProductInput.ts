import { InputType, Field } from '@nestjs/graphql'
import { IsInt, IsString } from 'class-validator'

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  title: string

  @Field()
  @IsString()
  category: string

  @Field()
  @IsString()
  description: string

  @Field()
  @IsInt()
  quantity: number

  @Field()
  @IsInt()
  price: number
}
