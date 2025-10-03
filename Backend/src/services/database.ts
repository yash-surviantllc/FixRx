import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';
import { config } from '@/config/environment';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: config.isDevelopment
        ? [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'info' }, { emit: 'stdout', level: 'warn' }, { emit: 'stdout', level: 'error' }]
        : [{ emit: 'stdout', level: 'error' }],
      datasources: {
        db: {
          url: config.database.url,
        },
      },
    });

    // Add query logging in development
    // Note: Query logging temporarily disabled due to TypeScript issues
    // if (config.isDevelopment) {
    //   this.prisma.$on('query', (e: any) => {
    //     logger.debug('Database Query:', {
    //       query: e.query,
    //       params: e.params,
    //       duration: `${e.duration}ms`,
    //     });
    //   });
    // }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public static async connect(): Promise<void> {
    const instance = DatabaseService.getInstance();
    try {
      await instance.prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    const instance = DatabaseService.getInstance();
    try {
      await instance.prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  public static getClient(): PrismaClient {
    const instance = DatabaseService.getInstance();
    return instance.prisma;
  }

  // Health check method
  public static async healthCheck(): Promise<boolean> {
    const instance = DatabaseService.getInstance();
    try {
      await instance.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  // Transaction wrapper
  public static async transaction<T>(
    fn: (prisma: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    const instance = DatabaseService.getInstance();
    return instance.prisma.$transaction(fn);
  }
}

// Export the Prisma client instance for direct use
export const prisma = DatabaseService.getClient();
export { DatabaseService };
export default DatabaseService;
