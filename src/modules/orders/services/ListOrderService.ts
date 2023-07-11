import { getManager } from 'typeorm'
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination'
import Order from '../typeorm/entities/Order'
import OrdersRepository from '../typeorm/repositories/OrdersRepository'
import RedisCache from '@shared/cache/RedisCache'
import { ORDER_LIST } from '@config/redis/vars'

interface IPaginateOrder {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: Order[]
}

class ListOrderService {
  public async execute(): Promise<IPaginateOrder> {
    const entityManager = getManager()
    const ordersRepository = entityManager.getCustomRepository(OrdersRepository)

    const redisCache = RedisCache

    let orders: PaginationAwareObject

    const cachedOrders = await redisCache.recovery<PaginationAwareObject>(
      ORDER_LIST
    )

    if (!cachedOrders) {
      orders = await ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.customer', 'customer')
        .leftJoinAndSelect('order.order_products', 'order_products')
        .paginate()

      await redisCache.save(ORDER_LIST, orders)
    } else {
      orders = cachedOrders
    }

    return orders as IPaginateOrder
  }
}

export default ListOrderService
