import AppError from '@shared/errors/AppError'
import { hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import RedisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'

interface IRequest {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)
    const emailExists = await usersRepository.findByEmail(email)

    if (emailExists) {
      throw new AppError('There is already a user with this email address.')
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate(USER_LIST)

    const hashedPassword = await hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword
    })

    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
