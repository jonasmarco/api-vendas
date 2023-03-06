import { EntityRepository, Repository } from 'typeorm'
import UserToken from '../entities/UserToken'

@EntityRepository(UserToken)
export default class UserTokensRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    return await this.findOne({
      where: {
        token
      }
    })
  }

  public async generateToken(user_id: string): Promise<UserToken | undefined> {
    const userToken = this.create({
      user_id
    })

    await this.save(userToken)

    return userToken
  }

  public async findByUser_id(user_id: string): Promise<UserToken | undefined> {
    return await this.findOne({
      where: {
        user_id
      }
    })
  }
}
