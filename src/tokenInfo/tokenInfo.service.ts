import { HttpException, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UserDataDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenInfoService {
  constructor(private redis: RedisService) {}

  async getMockData(accessKey: string, ip: string) {
    try {
      // Validate access key exist in redis
      const user: UserDataDto = await this.valiadteAccessKey(accessKey);

      // Check API rate limit
      const isRateLimited = await this.isRateLimited(user, ip);
      if (isRateLimited) {
        throw new HttpException('Rate limit exceed', 429);
      }
      return { 'token-info': 'Active' };
    } catch (err) {
      throw err;
    }
  }

  async isRateLimited(user: UserDataDto, ip: string): Promise<boolean> {
    try {
      // Get number of requests
      const requests: number = await this.redis.increaseIPValue(ip);

      // Set expiry time 1 minute for first request
      if (requests === 1) {
        await this.redis.setKeyExpiryTime(ip, 60);
      }

      // Check if number of requests exceed
      if (requests > user.requestRateLimit) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  async valiadteAccessKey(accessKey: string): Promise<UserDataDto> {
    try {
      // Get all user keys
      const userEmails: string[] = await this.redis.getUserKeys('*key*');

      // Get all users data
      const users: string[] = await this.redis.getDataFormKeys(userEmails);
      if (!users) {
        throw new HttpException('Users not exists in Database', 400);
      }

      const userDetails: UserDataDto[] = users.map((user) => JSON.parse(user));

      // Validate the access token
      let user: UserDataDto;
      for (let index = 0; index < userDetails.length; index += 1) {
        const userDetail: UserDataDto = userDetails[index];
        const isUserExist: boolean = await bcrypt.compare(
          userDetail.userEmail,
          accessKey,
        );
        if (isUserExist) {
          user = userDetail;
        }
      }

      if (!user) {
        throw new HttpException('Invalid access token', 400);
      }
      return user;
    } catch (err) {
      throw err;
    }
  }
}
