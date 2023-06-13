import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Customer from '../typeorm/entities/Customer'
import CustomersRepository from '../typeorm/repositories/CustomersRepository'
import RedisCache from '@shared/cache/RedisCache'
import { CUSTOMER_LIST } from '@config/redis/vars'

interface IRequest {
  name: string
  email: string
}

class CreateCustomerService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository)
    const emailExists = await customersRepository.findByEmail(email)

    if (emailExists) {
      throw new AppError('There is already a customer with this email address.')
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate(CUSTOMER_LIST)

    const customer = customersRepository.create({
      name,
      email
    })
    await customersRepository.save(customer)

    return customer
  }
}

export default CreateCustomerService
