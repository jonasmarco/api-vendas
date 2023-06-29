import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import CustomersRepository from '../typeorm/repositories/CustomersRepository'
import redisCache from '@shared/cache/RedisCache'
import { CUSTOMER_LIST } from '@config/redis/vars'

interface IRequest {
  id: string
}

class DeleteCustomerService {
  public async execute({ id }: IRequest): Promise<void> {
    const customersRepository = getCustomRepository(CustomersRepository)

    const customer = await customersRepository.findById(id)

    if (!customer) {
      throw new AppError('Customer not found')
    }

    await redisCache.invalidate(CUSTOMER_LIST)

    await customersRepository.remove(customer)
  }
}

export default DeleteCustomerService
