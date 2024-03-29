import AppError from '@shared/errors/AppError'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import authConfig from '@config/auth'
import { getCustomRepository } from 'typeorm'
import User from '../infra/typeorm/entities/User'
import UsersRepository from '../infra/typeorm/repositories/UsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect e-mail or password.', 401)
    }

    const passwordConfirmed = await compare(password, user.password)

    if (!passwordConfirmed) {
      throw new AppError('Incorrect e-mail or password.', 401)
    }

    const secret = authConfig.jwt.secret

    if (!secret) {
      throw new Error('JWT secret must be defined')
    }

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn
    })

    return { user, token }
  }
}

export default CreateSessionsService
