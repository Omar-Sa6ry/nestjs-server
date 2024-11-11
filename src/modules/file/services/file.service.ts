import { Injectable } from '@nestjs/common'
import { FileUpload } from 'graphql-upload-minimal'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class FileService {
  async uploadFile (file: FileUpload) {
    console.log("uhuh")
    const { createReadStream, filename } = file
    const uploadDir = path.join(process.cwd(), 'uploads')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)
    const stream = createReadStream()
    const out = fs.createWriteStream(filePath)
    stream.pipe(out)
    await new Promise((resolve, reject) => {
      out.on('finish', resolve)
      out.on('error', reject)
    })
console.log(filePath)
    return filePath
  }

  async uploadFiles (files: FileUpload[]): Promise<string[]> {
    const filePaths = await Promise.all(
      files.map(file => this.uploadFile(file)),
    )
    return filePaths
  }
}
