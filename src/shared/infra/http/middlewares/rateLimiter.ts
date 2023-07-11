import { Request, Response, NextFunction } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import AppError from '@shared/errors/AppError'
import RedisCache from '@shared/cache/RedisCache'

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const redisCache = RedisCache

    const limiter = new RateLimiterRedis({
      storeClient: redisCache.client,
      keyPrefix: 'ratelimit',
      points: 5,
      duration: 1
    })

    await limiter.consume(request.ip)

    return next()
  } catch (err) {
    throw new AppError('Too many requests.', 429)
  }
}
