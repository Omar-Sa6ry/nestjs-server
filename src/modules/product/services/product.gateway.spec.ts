import { Test, TestingModule } from '@nestjs/testing'
import { ProductGateway } from './product.gateway'

describe('ProductGateway', () => {
  let gateway: ProductGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductGateway],
    }).compile()

    gateway = module.get<ProductGateway>(ProductGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
