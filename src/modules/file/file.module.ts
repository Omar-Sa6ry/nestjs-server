import { Module } from '@nestjs/common'
import { FileService } from './services/file.service'
import { FileResolver } from './resolver/file.resolver'

@Module({
  providers: [FileResolver, FileService],
  exports: [FileService],
})
export class FileModule {}
