import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsNumber, IsEmail, IsUrl } from 'class-validator'

@InputType()
export class OrderDataDto {
  @Field()
  @IsNumber()
  price: number

  @Field()
  @IsString()
  description: string

  @Field()
  @IsUrl()
  logo: string

  @Field()
  @IsUrl()
  success_url: string

  @Field()
  @IsUrl()
  cancel_url: string

  @Field()
  @IsString()
  userId: string

  @Field()
  @IsEmail()
  email: string
}
