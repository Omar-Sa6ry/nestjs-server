import { Field, InputType } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  quantity?: number

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  price?: number
}
