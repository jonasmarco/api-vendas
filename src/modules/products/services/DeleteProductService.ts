import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import ProductRepository from '../typeorm/repositories/ProductsRepository'
import RedisCache from '@shared/cache/RedisCache'
import { PRODUCT_LIST } from '@config/redis/vars'

interface IRequest {
  id: string
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository)

    const product = await productsRepository.findOne(id)

    if (!product) {
      throw new AppError('Product not found')
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate(PRODUCT_LIST)

    await productsRepository.remove(product)
  }
}

export default DeleteProductService
