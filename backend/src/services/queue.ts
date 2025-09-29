import Bull from 'bull';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

// Queue job types
export interface EmailJob {
  type: 'email';
  data: {
    to: string;
    subject: string;
    template?: string;
    templateData?: any;
    html?: string;
    text?: string;
  };
}

export interface SMSJob {
  type: 'sms';
  data: {
    to: string;
    message: string;
    from?: string;
  };
}

export interface NotificationJob {
  type: 'notification';
  data: {
    userId: string;
    title: string;
    body: string;
    data?: any;
  };
}

export type QueueJob = EmailJob | SMSJob | NotificationJob;

class QueueService {
  private static instance: QueueService;
  private emailQueue: Bull.Queue<EmailJob['data']>;
  private smsQueue: Bull.Queue<SMSJob['data']>;
  private notificationQueue: Bull.Queue<NotificationJob['data']>;

  private constructor() {
    const redisConfig = {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    };

    // Initialize queues
    this.emailQueue = new Bull('email queue', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    this.smsQueue = new Bull('sms queue', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    this.notificationQueue = new Bull('notification queue', {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    this.setupEventListeners();
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  public static async initialize(): Promise<void> {
    const instance = QueueService.getInstance();
    logger.info('Queue service initialized');
  }

  private setupEventListeners(): void {
    // Email queue events
    this.emailQueue.on('completed', (job) => {
      logger.info(`Email job ${job.id} completed`);
    });

    this.emailQueue.on('failed', (job, err) => {
      logger.error(`Email job ${job.id} failed:`, err);
    });

    // SMS queue events
    this.smsQueue.on('completed', (job) => {
      logger.info(`SMS job ${job.id} completed`);
    });

    this.smsQueue.on('failed', (job, err) => {
      logger.error(`SMS job ${job.id} failed:`, err);
    });

    // Notification queue events
    this.notificationQueue.on('completed', (job) => {
      logger.info(`Notification job ${job.id} completed`);
    });

    this.notificationQueue.on('failed', (job, err) => {
      logger.error(`Notification job ${job.id} failed:`, err);
    });
  }

  // Email queue methods
  public static async addEmailJob(
    data: EmailJob['data'],
    options?: Bull.JobOptions
  ): Promise<Bull.Job<EmailJob['data']>> {
    const instance = QueueService.getInstance();
    return instance.emailQueue.add(data, options);
  }

  public static async addBulkEmailJobs(
    jobs: Array<{ data: EmailJob['data']; opts?: Bull.JobOptions }>
  ): Promise<Bull.Job<EmailJob['data']>[]> {
    const instance = QueueService.getInstance();
    return instance.emailQueue.addBulk(jobs);
  }

  // SMS queue methods
  public static async addSMSJob(
    data: SMSJob['data'],
    options?: Bull.JobOptions
  ): Promise<Bull.Job<SMSJob['data']>> {
    const instance = QueueService.getInstance();
    return instance.smsQueue.add(data, options);
  }

  public static async addBulkSMSJobs(
    jobs: Array<{ data: SMSJob['data']; opts?: Bull.JobOptions }>
  ): Promise<Bull.Job<SMSJob['data']>[]> {
    const instance = QueueService.getInstance();
    return instance.smsQueue.addBulk(jobs);
  }

  // Notification queue methods
  public static async addNotificationJob(
    data: NotificationJob['data'],
    options?: Bull.JobOptions
  ): Promise<Bull.Job<NotificationJob['data']>> {
    const instance = QueueService.getInstance();
    return instance.notificationQueue.add(data, options);
  }

  // Queue processing methods
  public static processEmailQueue(processor: Bull.ProcessCallbackFunction<EmailJob['data']>): void {
    const instance = QueueService.getInstance();
    instance.emailQueue.process(processor);
  }

  public static processSMSQueue(processor: Bull.ProcessCallbackFunction<SMSJob['data']>): void {
    const instance = QueueService.getInstance();
    instance.smsQueue.process(processor);
  }

  public static processNotificationQueue(processor: Bull.ProcessCallbackFunction<NotificationJob['data']>): void {
    const instance = QueueService.getInstance();
    instance.notificationQueue.process(processor);
  }

  // Queue management methods
  public static async getEmailQueueStats(): Promise<any> {
    const instance = QueueService.getInstance();
    return {
      waiting: await instance.emailQueue.getWaiting(),
      active: await instance.emailQueue.getActive(),
      completed: await instance.emailQueue.getCompleted(),
      failed: await instance.emailQueue.getFailed(),
    };
  }

  public static async getSMSQueueStats(): Promise<any> {
    const instance = QueueService.getInstance();
    return {
      waiting: await instance.smsQueue.getWaiting(),
      active: await instance.smsQueue.getActive(),
      completed: await instance.smsQueue.getCompleted(),
      failed: await instance.smsQueue.getFailed(),
    };
  }

  public static async getNotificationQueueStats(): Promise<any> {
    const instance = QueueService.getInstance();
    return {
      waiting: await instance.notificationQueue.getWaiting(),
      active: await instance.notificationQueue.getActive(),
      completed: await instance.notificationQueue.getCompleted(),
      failed: await instance.notificationQueue.getFailed(),
    };
  }

  // Cleanup methods
  public static async close(): Promise<void> {
    const instance = QueueService.getInstance();
    await Promise.all([
      instance.emailQueue.close(),
      instance.smsQueue.close(),
      instance.notificationQueue.close(),
    ]);
    logger.info('All queues closed');
  }

  public static async cleanAllQueues(): Promise<void> {
    const instance = QueueService.getInstance();
    await Promise.all([
      instance.emailQueue.clean(0, 'completed'),
      instance.emailQueue.clean(0, 'failed'),
      instance.smsQueue.clean(0, 'completed'),
      instance.smsQueue.clean(0, 'failed'),
      instance.notificationQueue.clean(0, 'completed'),
      instance.notificationQueue.clean(0, 'failed'),
    ]);
    logger.info('All queues cleaned');
  }
}

export { QueueService };
export default QueueService;
