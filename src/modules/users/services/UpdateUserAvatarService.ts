import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import User from '../infra/typeorm/entities/User'
import UsersRepository from '../infra/typeorm/repositories/UsersRepository'
import checkImageType from '@helpers/checkImageType'
import redisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'
import uploadConfig from '@config/upload'
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider'
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider'

interface IRequest {
  user_id: string
  avatarFilename: string
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)

    const user = await usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    if (uploadConfig.driver === 's3') {
      const s3Provider = new S3StorageProvider()
      if (user.avatar) {
        if (checkImageType(user.avatar)) {
          await s3Provider.deleteFile(user.avatar)
        }
      }
      const filename = await s3Provider.saveFile(avatarFilename)
      user.avatar = filename
    } else {
      const diskProvider = new DiskStorageProvider()
      if (user.avatar) {
        if (checkImageType(user.avatar)) {
          await diskProvider.deleteFile(user.avatar)
        }
      }
      const filename = await diskProvider.saveFile(avatarFilename)
      user.avatar = filename
    }

    await redisCache.invalidate(USER_LIST)

    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
