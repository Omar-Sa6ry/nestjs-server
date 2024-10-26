import { User } from './User.entity'
import { CartProduct } from './CartProduct'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@ObjectType()
export class Cart {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: 'decimal', default: 0, nullable: true })
  cartTotal: number

  @Field()
  @Column({ type: 'decimal', default: 0, nullable: true })
  totalBeforeDiscount: number

  @Field()
  @ManyToOne(() => User, user => user.carts)
  owner: number

  @Field(() => [CartProduct])
  @OneToMany(() => CartProduct, cartProduct => cartProduct.cart, {
    cascade: true,
    nullable: true,
  })
  products: CartProduct[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
