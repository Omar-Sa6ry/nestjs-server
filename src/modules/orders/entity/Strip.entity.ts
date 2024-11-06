import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class StripeCheckoutSession {
  @Field()
  id: string

  @Field()
  object: string

  @Field()
  payment_status: string

  @Field()
  url: string
}
