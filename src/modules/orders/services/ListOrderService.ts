import { getCustomRepository } from 'typeorm'
import Order from '../typeorm/entities/Order'
import OrdersRepository from '../typeorm/repositories/OrdersRepository'

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
    const ordersRepository = getCustomRepository(OrdersRepository)

    const orders = await ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.order_products', 'order_products')
      .paginate()

    return orders as IPaginateOrder
  }
}

export default ListOrderService
