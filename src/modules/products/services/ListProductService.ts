import { getManager } from 'typeorm'
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination'
import Product from '../typeorm/entities/Product'
import ProductRepository from '../typeorm/repositories/ProductsRepository'
import RedisCache from '@shared/cache/RedisCache'
import { PRODUCT_LIST } from '@config/redis/vars'

interface IPaginateProduct {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: Product[]
}

class ListProductService {
  public async execute(): Promise<IPaginateProduct> {
    const entityManager = getManager()
    const productsRepository =
      entityManager.getCustomRepository(ProductRepository)

    const redisCache = RedisCache

    let products: PaginationAwareObject

    const cachedProducts = await redisCache.recovery<PaginationAwareObject>(
      PRODUCT_LIST
    )

    if (!cachedProducts) {
      products = await productsRepository.createQueryBuilder().paginate()

      await redisCache.save(PRODUCT_LIST, products)
    } else {
      products = cachedProducts
    }

    return products as IPaginateProduct
  }
}

export default ListProductService
