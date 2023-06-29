import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import checkImageType from '@helpers/checkImageType'
import redisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider'

interface IRequest {
  user_id: string
  avatarFilename: string
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)
    const storageProvider = new DiskStorageProvider()

    const user = await usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    if (user.avatar) {
      if (checkImageType(user.avatar)) {
        await storageProvider.deleteFile(user.avatar)
      }
    }

    await redisCache.invalidate(USER_LIST)

    const filename = await storageProvider.saveFile(avatarFilename)
    user.avatar = filename

    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
