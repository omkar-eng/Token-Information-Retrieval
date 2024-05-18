import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { RedisService } from './redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsumeKafkaData implements OnModuleInit {
  constructor(
    private kafkaConsumer: ConsumerService,
    private redisClient: RedisService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.consume(
      {
        topic: this.configService.get<string>('KAFKA_TOPIC'),
        fromBeginning: true,
      },
      {
        eachMessage: async ({ message }) => {
          const userMessage: string = message.value.toString();
          const messageDetails = JSON.parse(userMessage);
          const { KafkaMessage, key, ...payload } = messageDetails;
          if (
            KafkaMessage === 'genearte key' ||
            KafkaMessage === 'update key'
          ) {
            // Update and Add key in Service 2 Redis, If access key updated or added in service 1 Redis
            await this.redisClient.setKey(key, JSON.stringify(payload));
          } else if (KafkaMessage === 'delete key') {
            // Delete the key in Redis, If access key deleted in service 1 Redis
            await this.redisClient.deleteKey(key);
          }
        },
      },
    );
  }
}
