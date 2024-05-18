import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private redisClient: Redis) {}
  async keyExists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      return false;
    }
  }

  async setKey(key: string, value: string) {
    try {
      await this.redisClient.set(key, value);
    } catch (error) {
      throw new HttpException('Unable to set key in Redis', 400);
    }
  }

  async deleteKey(key: string) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      throw new HttpException('Unable to delete key in Redis', 400);
    }
  }

  async getKey(key: string): Promise<string> {
    try {
      const data = await this.redisClient.get(key);
      return data;
    } catch (error) {
      throw new HttpException('Unable to fetch data from Redis', 400);
    }
  }

  async setKeyExpiryTime(key: string, expiryTime: number) {
    try {
      await this.redisClient.expire(key, expiryTime);
    } catch (error) {
      throw new HttpException(
        'Unable to set expiry time for a key in Redis',
        400,
      );
    }
  }

  async getUserKeys(pattern: string): Promise<string[]> {
    try {
      const data: string[] = await this.redisClient.keys(pattern);
      return data;
    } catch (error) {
      throw new HttpException('Unable to fetch keys from Redis', 400);
    }
  }

  async increaseIPValue(key: string): Promise<number> {
    try {
      const data: number = await this.redisClient.incr(key);
      return data;
    } catch (error) {
      throw new HttpException('Unable to increament key in Redis', 400);
    }
  }

  async getDataFormKeys(keys: string[]): Promise<string[]> {
    try {
      if (keys.length) {
        const data: string[] = await this.redisClient.mget(keys);
        return data;
      }
    } catch (error) {
      throw new HttpException(
        'Unable to fetch data using keys from Redis',
        400,
      );
    }
  }
}
