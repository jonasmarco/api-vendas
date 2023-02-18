import { EntityRepository, Repository } from 'typeorm'
import User from '../entities/Users'

@EntityRepository(User)
export default class UsersRepository extends Repository<User> {
  public async findByName(name: string): Promise<User | undefined> {
    return this.findOne({
      where: {
        name
      }
    })
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.findOne({
      where: {
        id
      }
    })
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({
      where: {
        email
      }
    })
  }
}
