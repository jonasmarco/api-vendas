import AppError from '@shared/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../infra/typeorm/entities/User'
import UsersRepository from '../infra/typeorm/repositories/UsersRepository'
import redisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'

interface IRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)

    const user = await usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    const userUpdateEmail = await usersRepository.findByEmail(email)

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError('There is already a user with this email address.')
    }

    if (password && !old_password) {
      throw new AppError('Old password is required.')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.')
      }

      user.password = await hash(password, 8)
    }

    await redisCache.invalidate(USER_LIST)

    user.name = name
    user.email = email

    await usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
