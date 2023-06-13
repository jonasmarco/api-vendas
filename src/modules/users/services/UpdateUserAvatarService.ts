import AppError from '@shared/errors/AppError'
import path from 'path'
import fs from 'fs'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import uploadConfig from '@config/upload'
import checkImageName from '@helpers/checkImageName'
import RedisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'

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

    if (user.avatar) {
      if (checkImageName(user.avatar)) {
        const userAvatarFilePath = path.join(
          uploadConfig.directory,
          user.avatar
        )
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath)
        }
      }
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate(USER_LIST)

    user.avatar = avatarFilename

    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
