import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { FileService } from './file.service'
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal'

@Resolver()
export class FileResolver {
  constructor (private readonly fileService: FileService) {}

  @Mutation(() => String)
  async uploadFile (
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return this.fileService.uploadFile(file)
  }
}
