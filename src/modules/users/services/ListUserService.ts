import { getManager } from 'typeorm'
import { PaginationAwareObject } from 'typeorm-pagination/dist/helpers/pagination'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import RedisCache from '@shared/cache/RedisCache'
import { USER_LIST } from '@config/redis/vars'

interface IPaginateUser {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: User[]
}

class ListUserService {
  public async execute(): Promise<IPaginateUser> {
    const entityManager = getManager()
    const usersRepository = entityManager.getCustomRepository(UsersRepository)

    const redisCache = new RedisCache()

    let users: PaginationAwareObject

    const cachedUsers = await redisCache.recovery<PaginationAwareObject>(
      USER_LIST
    )

    if (!cachedUsers) {
      users = await usersRepository.createQueryBuilder().paginate()

      await redisCache.save(USER_LIST, users)
    } else {
      users = cachedUsers
    }

    return users as IPaginateUser
  }
}

export default ListUserService
