import Redis, { Redis as RedisClient } from 'ioredis'
import cacheConfig from '@config/redis/cache'

export default class RedisCache {
  public client: RedisClient

  constructor() {
    this.client = new Redis(cacheConfig.config.redis)
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }

  public async recovery<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    return JSON.parse(data) as T
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key)
  }
}
