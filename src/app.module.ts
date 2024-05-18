import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenInfoModule } from './tokenInfo/tokenInfo.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { ConsumeKafkaData } from './consume-kafka-data';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TokenInfoModule,
    KafkaModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConsumeKafkaData, RedisService],
})
export class AppModule {}
