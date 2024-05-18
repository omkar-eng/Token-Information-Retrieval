import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenInfoService } from './tokenInfo.service';
import { TokenInfoController } from './tokenInfo.controller';
import { ValidateTokenMiddleware } from '../middleware/validate-token.middleware';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [TokenInfoService, RedisService],
  controllers: [TokenInfoController],
})
export class TokenInfoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTokenMiddleware).forRoutes(TokenInfoController);
  }
}
