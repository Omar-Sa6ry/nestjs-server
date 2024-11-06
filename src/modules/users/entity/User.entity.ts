import { Product } from '../../product/entity/Product.entity'
import { Cart } from '../../cart/entity/Cart.entity'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id: number

  @Column()
  @Field({ nullable: true })
  username: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  email: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  password: string

  @Column({ default: true })
  admin: boolean

  @Field(() => [Cart])
  @OneToMany(() => Cart, cart => cart.owner)
  carts: Cart[]

  @Field(() => [Product])
  @OneToMany(() => Product, product => product.owner)
  products: Product[]

  @Column({ nullable: true })
  resetToken?: string

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiry?: Date

  @AfterInsert()
  logInsert () {
    console.log('Inserted User with id: ' + this.id)
  }

  @AfterUpdate()
  logUpdate () {
    console.log('Updated User with id: ' + this.id)
  }

  @AfterRemove()
  logRemove () {
    console.log('Removed User with id: ' + this.id)
  }
}
