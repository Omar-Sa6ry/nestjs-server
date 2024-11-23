import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql'
import { UpdateProductInput } from 'src/modules/product/dtos/UpdateProductInput'
import { CreateProductInput } from 'src/modules/product/dtos/CreateProductInput'
import { ProductService } from '../services/produt.service'
import { Product } from '../entity/Product.entity'
import { RoleGuard } from 'src/guards/role.guard'
import { JwtGuard } from 'src/guards/jwt.guard'
import { SessionGuard } from 'src/guards/session.guard'
import { ProductDto } from '../dtos/Product.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common'
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal'

@Resolver(of => Product)
export class ProductResolver {
  constructor (private productService: ProductService) {}

  @UseGuards(SessionGuard, JwtGuard, RoleGuard)
  @Serialize(ProductDto)
  @Mutation(() => Product)
  async createProduct (
    @Args('createProductInput', new ValidationPipe())
    createProductInput: CreateProductInput,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    // // upload alotof images
    // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Context('req') req,
  ): Promise<Product> {
    const owner: number = req.session.userId
    console.log(file)
    return this.productService.create(createProductInput, owner, file)
  }

  @Query(returns => Product, { nullable: true })
  @Serialize(ProductDto)
  getProductById (@Args('id', ParseIntPipe) id: number) {
    return this.productService.findById(id)
  }

  @Query(returns => Product, { nullable: true })
  getProductByTitle (@Args('id', ParseIntPipe) id: number) {
    return this.productService.find(id)
  }

  @UseGuards(SessionGuard, JwtGuard, RoleGuard)
  @Serialize(ProductDto)
  @Mutation(() => Product)
  async updateProduct (
    @Args('id', ParseIntPipe) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(id, updateProductInput)
  }

  @UseGuards(SessionGuard, JwtGuard, RoleGuard)
  @Mutation(() => String)
  async deleteProduct (@Args('id', ParseIntPipe) id: number) {
    return this.productService.delete(id)
  }
}
