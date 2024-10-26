import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from './User.entity'

@Entity()
@Unique(['title'])
@ObjectType()
export class Product {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  description: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string

  @Column()
  @Field()
  price: number

  @Column()
  @Field()
  category: string

  @Field()
  @Column({ type: 'int' })
  quantity: number

  @Field()
  @ManyToOne(() => User, user => user.products)
  owner: number

  @AfterInsert()
  logInsert () {
    console.log('Inserted Product with id: ' + this.id)
  }

  @AfterUpdate()
  logUpdate () {
    console.log('Updated Product with id: ' + this.id)
  }

  @AfterRemove()
  logRemove () {
    console.log('Removed Product with id: ' + this.id)
  }
}
