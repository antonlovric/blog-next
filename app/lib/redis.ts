import { createClient, RedisClientType } from 'redis';

export class RedisService {
  client: RedisClientType | null = null;
  constructor() {
    if (!this.client) {
      this.client = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT ?? '16390'),
        },
      });
      this.client.connect();
    }
  }
}

const redis = new RedisService();
export const redisClient = redis.client;

redisClient?.on('error', (e) => console.error(e));

process.on('SIGINT', () => redisClient?.disconnect());
process.on('SIGTERM', () => redisClient?.disconnect());
