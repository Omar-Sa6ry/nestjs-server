import { Cart } from './Cart.entity'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export class CartProduct {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  productId: string

  @Field()
  @Column({ type: 'int' })
  quantity: number

  @Field()
  @Column({ type: 'decimal' })
  price: number

  @ManyToOne(() => Cart, cart => cart.products)
  cart: Cart
}
