import { getManager } from 'typeorm'
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination'
import Customer from '../typeorm/entities/Customer'
import CustomersRepository from '../typeorm/repositories/CustomersRepository'
import RedisCache from '@shared/cache/RedisCache'
import { CUSTOMER_LIST } from '@config/redis/vars'

interface IPaginateCustomer {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: Customer[]
}

class ListCustomerService {
  public async execute(): Promise<IPaginateCustomer> {
    const entityManager = getManager()
    const customersRepository =
      entityManager.getCustomRepository(CustomersRepository)

    const redisCache = new RedisCache()

    let customers: PaginationAwareObject

    const cachedCustomer = await redisCache.recovery<PaginationAwareObject>(
      CUSTOMER_LIST
    )

    if (!cachedCustomer) {
      customers = await customersRepository.createQueryBuilder().paginate()

      await redisCache.save(CUSTOMER_LIST, customers)
    } else {
      customers = cachedCustomer
    }

    return customers as IPaginateCustomer
  }
}

export default ListCustomerService
