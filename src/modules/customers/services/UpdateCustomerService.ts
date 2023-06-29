import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Customer from '../typeorm/entities/Customer'
import CustomersRepository from '../typeorm/repositories/CustomersRepository'
import redisCache from '@shared/cache/RedisCache'
import { CUSTOMER_LIST } from '@config/redis/vars'

interface IRequest {
  id: string
  name: string
  email: string
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository)

    const customer = await customersRepository.findById(id)

    if (!customer) {
      throw new AppError('Customer not found.')
    }

    const customerExist = await customersRepository.findByEmail(email)

    if (customerExist && email !== customer.email) {
      throw new AppError('There is already a customer with this email address.')
    }

    await redisCache.invalidate(CUSTOMER_LIST)

    customer.name = name
    customer.email = email

    await customersRepository.save(customer)

    return customer
  }
}

export default UpdateCustomerService
