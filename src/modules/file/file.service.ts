import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import { FileUpload } from 'graphql-upload-minimal'
import * as path from 'path'

@Injectable()
export class FileService {
  async uploadFile (file: FileUpload) {
    const { createReadStream, filename } = file
    const uploadDir = path.join(process.cwd(), 'uploads')

    // Ensure the uploads directory exists
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

    return out.path
  }
}
