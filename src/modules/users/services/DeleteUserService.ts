import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import RedisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'

interface IRequest {
  id: string
}

class DeleteUserService {
  public async execute({ id }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UsersRepository)

    const user = await userRepository.findById(id)

    if (!user) {
      throw new AppError('User not found')
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate(USER_LIST)

    await userRepository.remove(user)
  }
}

export default DeleteUserService
