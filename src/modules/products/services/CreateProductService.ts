import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../infra/typeorm/entities/Product'
import ProductRepository from '../infra/typeorm/repositories/ProductsRepository'
import redisCache from '@shared/cache/RedisCache'
import { PRODUCT_LIST } from '@config/redis/vars'

interface IRequest {
  name: string
  price: number
  quantity: number
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository)
    const productExists = await productsRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already a product with this name')
    }

    await redisCache.invalidate(PRODUCT_LIST)

    const product = productsRepository.create({ name, price, quantity })
    await productsRepository.save(product)

    return product
  }
}

export default CreateProductService
