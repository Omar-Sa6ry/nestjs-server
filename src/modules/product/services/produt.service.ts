import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateProductInput } from 'src/modules/product/dtos/CreateProductInput'
import { UpdateProductInput } from 'src/modules/product/dtos/UpdateProductInput'
import { ProductGateway } from './product.gateway'
import { Product } from '../entity/Product.entity'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FileUpload } from 'graphql-upload-minimal'
import { FileService } from 'src/modules/file/services/file.service'

@Injectable()
export class ProductService {
  constructor (
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly fileService: FileService,
    private readonly productGateway: ProductGateway, // Inject gateway for Socket.IO
  ) {}

  async create (
    createProductInput: CreateProductInput,
    owner: number,
    image: FileUpload,
    // // To Upload alotof images
    // images: FileUpload[]
  ): Promise<Product> {
    const filePath = await this.fileService.uploadFile(image)

    // // To Upload alotof images
    // const filePath = await this.fileService.uploadFiles(images)

    const product = this.productRepository.create({
      ...createProductInput,
      // image: filePath,
      owner,
    })

    const savedProduct = await this.productRepository.save(product)
    this.productGateway.server.emit('newProduct', savedProduct) // Emit event
    return savedProduct
  }

  async findById (id: number) {
    const product = await this.productRepository.findOne({ where: { id } })
    if (!product) {
      new NotFoundException(`Product with ${id} not found`)
    }
    return product
  }

  async find (title) {
    const product = await this.productRepository.find({ where: { title } })
    if (!product) {
      new NotFoundException(`Product with ${title} not found`)
    }
    return product
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
