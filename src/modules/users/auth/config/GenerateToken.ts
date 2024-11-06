import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class GenerateToken {  
  constructor (
 private jwtService: JwtService
  ) {}
  async generateToken (email: string) {
    const payload = { email: email }
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    })
  }
}
