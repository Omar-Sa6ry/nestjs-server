import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal'
import { FileService } from '../services/file.service'

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
