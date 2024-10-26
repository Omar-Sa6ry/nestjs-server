import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '../models/product.entity'
import { ProductGateway } from './product.gateway'
import { CreateProductInput } from 'src/dtos/CreateProductInput'
import { UpdateProductInput } from 'src/dtos/UpdateProductInput'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class ProductService {
  constructor (
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly productGateway: ProductGateway, // Inject gateway for Socket.IO
  ) {}

  async create (
    createProductInput: CreateProductInput,
    // image: string,
    owner: number,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductInput,
      // image,
      owner,
    })

    const savedProduct = await this.productRepository.save(product)
    this.productGateway.server.emit('newProduct', savedProduct) // Emit event
    return savedProduct
  }

  findById (id: number) {
    return this.productRepository.findOne({ where: { id } })
  }

  find (title) {
    return this.productRepository.find({ where: { title } })
  }

  async update (id: number, updateProductInput: UpdateProductInput) {
    const existingProductById = await this.productRepository.findOne({
      where: { id },
    })
    if (!existingProductById) {
      throw new BadRequestException('Product not found')
    }

    Object.assign(existingProductById, updateProductInput)
    return this.productRepository.save(existingProductById)
  }

  async delete (id: number) {
    const product = await this.productRepository.findOne({ where: { id } })
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    await this.productRepository.remove(product)
    return `Product with id ${id} successfully deleted`
  }
}
