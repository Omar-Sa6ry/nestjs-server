import { Expose } from 'class-transformer'

export class ProductDto {
  @Expose()
  id: number

  @Expose()
  category: string

  @Expose()
  image: string

  @Expose()
  quantity: number

  @Expose()
  title: string

  @Expose()
  description: string

  @Expose()
  price: number

  @Expose()
  owner: number
}
