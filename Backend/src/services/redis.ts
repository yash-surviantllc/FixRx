import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const redisConfig = {
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
    };

    this.client = createClient(redisConfig);

    // Event listeners
    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      logger.error('Redis client error:', err);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
      this.isConnected = false;
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public static async connect(): Promise<void> {
    const instance = RedisService.getInstance();
    try {
      if (!instance.isConnected) {
        await instance.client.connect();
        logger.info('Redis connected successfully');
      }
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    const instance = RedisService.getInstance();
    try {
      if (instance.isConnected) {
        await instance.client.disconnect();
        logger.info('Redis disconnected successfully');
      }
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }

  public static getClient(): RedisClientType {
    const instance = RedisService.getInstance();
    return instance.client;
  }

  public static isConnected(): boolean {
    const instance = RedisService.getInstance();
    return instance.isConnected;
  }

  // Cache operations
  public static async set(
    key: string, 
    value: string | number | object, 
    ttl?: number
  ): Promise<void> {
    const instance = RedisService.getInstance();
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      if (ttl) {
        await instance.client.setEx(key, ttl, stringValue);
      } else {
        await instance.client.set(key, stringValue);
      }
    } catch (error) {
      logger.error('Redis SET error:', error);
      throw error;
    }
  }

  public static async get(key: string): Promise<string | null> {
    const instance = RedisService.getInstance();
    try {
      return await instance.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      throw error;
    }
  }

  public static async getJSON<T>(key: string): Promise<T | null> {
    const value = await RedisService.get(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        logger.error('JSON parse error:', error);
        return null;
      }
    }
    return null;
  }

  public static async del(key: string): Promise<number> {
    const instance = RedisService.getInstance();
    try {
      return await instance.client.del(key);
    } catch (error) {
      logger.error('Redis DEL error:', error);
      throw error;
    }
  }

  public static async exists(key: string): Promise<boolean> {
    const instance = RedisService.getInstance();
    try {
      const result = await instance.client.exists(key);
      return result > 0;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  public static async expire(key: string, ttl: number): Promise<boolean> {
    const instance = RedisService.getInstance();
    try {
      const result = await instance.client.expire(key, ttl);
      return result;
    } catch (error) {
      logger.error('Redis EXPIRE error:', error);
      throw error;
    }
  }

  public static async flushAll(): Promise<void> {
    const instance = RedisService.getInstance();
    try {
      await instance.client.flushAll();
    } catch (error) {
      logger.error('Redis FLUSHALL error:', error);
      throw error;
    }
  }

  // Session operations
  public static async setSession(sessionId: string, data: object, ttl: number = 3600): Promise<void> {
    await RedisService.set(`session:${sessionId}`, data, ttl);
  }

  public static async getSession<T>(sessionId: string): Promise<T | null> {
    return await RedisService.getJSON<T>(`session:${sessionId}`);
  }

  public static async deleteSession(sessionId: string): Promise<number> {
    return await RedisService.del(`session:${sessionId}`);
  }

  // Rate limiting operations
  public static async incr(key: string): Promise<number> {
    const instance = RedisService.getInstance();
    try {
      return await instance.client.incr(key);
    } catch (error) {
      logger.error('Redis INCR error:', error);
      throw error;
    }
  }

  public static async ttl(key: string): Promise<number> {
    const instance = RedisService.getInstance();
    try {
      return await instance.client.ttl(key);
    } catch (error) {
      logger.error('Redis TTL error:', error);
      throw error;
    }
  }

  public static async setEx(key: string, ttl: number, value: string): Promise<void> {
    const instance = RedisService.getInstance();
    try {
      await instance.client.setEx(key, ttl, value);
    } catch (error) {
      logger.error('Redis SETEX error:', error);
      throw error;
    }
  }

  // Health check
  public static async healthCheck(): Promise<boolean> {
    try {
      const result = await RedisService.get('health_check');
      await RedisService.set('health_check', 'ok', 10);
      return true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }
}

export { RedisService };
export default RedisService;
