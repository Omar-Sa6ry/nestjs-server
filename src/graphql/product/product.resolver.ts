import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql'
import {
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { AdminGuard } from 'src/guards/admin.guard'
import { Product } from '../models/product.entity'
import { ProductService } from './produt.service'
import { UpdateProductInput } from 'src/graphql/product/dtos/UpdateProductInput'
import { CreateProductInput } from 'src/graphql/product/dtos/CreateProductInput'

@Resolver(of => Product)
export class ProductResolver {
  constructor (private productService: ProductService) {}

  @UseGuards(AdminGuard)
  @Mutation(() => Product)
  async createProduct (
    @Args('createProductInput', new ValidationPipe())
    createProductInput: CreateProductInput,
    @Context('req') req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    const owner: number = req.session.userId
    console.log(owner)
    // const image = file ? `/uploads/${file.filename}` : null
    return this.productService.create(createProductInput, owner)
  }

  @Query(returns => Product, { nullable: true })
  getProductById (@Args('id', ParseIntPipe) id: number) {
    return this.productService.findById(id)
  }

  @Query(returns => Product, { nullable: true })
  getProductByTitle (@Args('id', ParseIntPipe) id: number) {
    return this.productService.find(id)
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Product)
  async updateProduct (
    @Args('id', ParseIntPipe) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(id, updateProductInput)
  }

  @UseGuards(AdminGuard)
  @Mutation(() => String)
  async deleteProduct (@Args('id', ParseIntPipe) id: number) {
    return this.productService.delete(id)
  }
}
