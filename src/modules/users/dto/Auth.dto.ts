import { ObjectType, Field } from '@nestjs/graphql'
import { UserDto } from './user.dto'
import { User } from '../entity/User.entity'

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User

  @Field()
  token: string
}
