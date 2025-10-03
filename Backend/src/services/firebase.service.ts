import * as admin from 'firebase-admin';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Firebase Service for push notifications
 * Handles device token management, topic subscriptions, and notification sending
 */

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  clickAction?: string;
}

interface SendNotificationOptions {
  token?: string;
  tokens?: string[];
  topic?: string;
  condition?: string;
  payload: NotificationPayload;
}

interface NotificationResult {
  success: boolean;
  messageId?: string;
  failureCount?: number;
  successCount?: number;
  error?: string;
  responses?: admin.messaging.SendResponse[];
}

class FirebaseService {
  private static instance: FirebaseService;
  private messaging: admin.messaging.Messaging | null = null;
  private isConfigured: boolean = false;

  private constructor() {
    this.initializeFirebase();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private initializeFirebase(): void {
    if (config.firebase.projectId && config.firebase.privateKey && config.firebase.clientEmail) {
      try {
        const serviceAccount = {
          type: 'service_account',
          project_id: config.firebase.projectId,
          private_key_id: config.firebase.privateKeyId,
          private_key: config.firebase.privateKey,
          client_email: config.firebase.clientEmail,
          client_id: config.firebase.clientId,
          auth_uri: config.firebase.authUri || 'https://accounts.google.com/o/oauth2/auth',
          token_uri: config.firebase.tokenUri || 'https://oauth2.googleapis.com/token',
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
          projectId: config.firebase.projectId,
        });

        this.messaging = admin.messaging();
        this.isConfigured = true;
        logger.info('Firebase service initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize Firebase:', error);
        this.isConfigured = false;
      }
    } else {
      logger.warn('Firebase credentials not provided, push notification service disabled');
      this.isConfigured = false;
    }
  }

  /**
   * Send notification to a single device token
   */
  public static async sendToToken(token: string, payload: NotificationPayload): Promise<NotificationResult> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      logger.error('Firebase not configured, cannot send notification');
      return {
        success: false,
        error: 'Firebase service not configured'
      };
    }

    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          notification: {
            clickAction: payload.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
            priority: 'high' as const,
            defaultSound: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await instance.messaging.send(message);

      logger.info(`Notification sent successfully to token: ${token.substring(0, 20)}...`);

      return {
        success: true,
        messageId: response,
        successCount: 1,
        failureCount: 0,
      };

    } catch (error: any) {
      logger.error('Failed to send notification to token:', {
        token: token.substring(0, 20) + '...',
        error: error.message,
        code: error.code,
      });

      return {
        success: false,
        error: error.message,
        successCount: 0,
        failureCount: 1,
      };
    }
  }

  /**
   * Send notification to multiple device tokens
   */
  public static async sendToTokens(tokens: string[], payload: NotificationPayload): Promise<NotificationResult> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      logger.error('Firebase not configured, cannot send notifications');
      return {
        success: false,
        error: 'Firebase service not configured'
      };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          notification: {
            clickAction: payload.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
            priority: 'high' as const,
            defaultSound: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await instance.messaging.sendMulticast(message);

      logger.info(`Multicast notification sent: ${response.successCount} successful, ${response.failureCount} failed`);

      return {
        success: response.successCount > 0,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };

    } catch (error: any) {
      logger.error('Failed to send multicast notification:', {
        tokenCount: tokens.length,
        error: error.message,
        code: error.code,
      });

      return {
        success: false,
        error: error.message,
        successCount: 0,
        failureCount: tokens.length,
      };
    }
  }

  /**
   * Send notification to a topic
   */
  public static async sendToTopic(topic: string, payload: NotificationPayload): Promise<NotificationResult> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      logger.error('Firebase not configured, cannot send topic notification');
      return {
        success: false,
        error: 'Firebase service not configured'
      };
    }

    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          notification: {
            clickAction: payload.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
            priority: 'high' as const,
            defaultSound: true,
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await instance.messaging.send(message);

      logger.info(`Topic notification sent successfully to topic: ${topic}`);

      return {
        success: true,
        messageId: response,
      };

    } catch (error: any) {
      logger.error('Failed to send topic notification:', {
        topic,
        error: error.message,
        code: error.code,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Subscribe tokens to a topic
   */
  public static async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      logger.error('Firebase not configured, cannot subscribe to topic');
      return false;
    }

    try {
      const response = await instance.messaging.subscribeToTopic(tokens, topic);
      
      logger.info(`Topic subscription: ${response.successCount} successful, ${response.failureCount} failed for topic: ${topic}`);
      
      return response.successCount > 0;

    } catch (error: any) {
      logger.error('Failed to subscribe to topic:', {
        topic,
        tokenCount: tokens.length,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Unsubscribe tokens from a topic
   */
  public static async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      logger.error('Firebase not configured, cannot unsubscribe from topic');
      return false;
    }

    try {
      const response = await instance.messaging.unsubscribeFromTopic(tokens, topic);
      
      logger.info(`Topic unsubscription: ${response.successCount} successful, ${response.failureCount} failed for topic: ${topic}`);
      
      return response.successCount > 0;

    } catch (error: any) {
      logger.error('Failed to unsubscribe from topic:', {
        topic,
        tokenCount: tokens.length,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Validate device token
   */
  public static async validateToken(token: string): Promise<boolean> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      return false;
    }

    try {
      // Send a dry run message to validate token
      const message: admin.messaging.Message = {
        token,
        notification: {
          title: 'Test',
          body: 'Test',
        },
      };

      await instance.messaging.send(message, true); // dry run
      return true;

    } catch (error: any) {
      logger.debug('Token validation failed:', {
        token: token.substring(0, 20) + '...',
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get topic details
   */
  public static async getTopicDetails(topic: string): Promise<any> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      return null;
    }

    try {
      // Note: Firebase Admin SDK doesn't provide topic details API
      // This is a placeholder for future implementation
      logger.info(`Topic details requested for: ${topic}`);
      return { topic, status: 'active' };

    } catch (error: any) {
      logger.error('Failed to get topic details:', {
        topic,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Health check for Firebase service
   */
  public static async healthCheck(): Promise<boolean> {
    const instance = FirebaseService.getInstance();
    
    if (!instance.isConfigured || !instance.messaging) {
      return false;
    }

    try {
      // Perform a simple dry run to test configuration
      const testMessage: admin.messaging.Message = {
        token: 'test-token-for-health-check',
        notification: {
          title: 'Health Check',
          body: 'Testing Firebase configuration',
        },
      };

      // This will fail because of invalid token, but validates config
      await instance.messaging.send(testMessage, true);
      return true;

    } catch (error: any) {
      // If error is about invalid token, config is OK
      if (error.code === 'messaging/invalid-registration-token') {
        return true;
      }
      
      logger.error('Firebase service health check failed:', error);
      return false;
    }
  }

  /**
   * Helper method to create notification payloads
   */
  public static createNotificationPayload(
    title: string,
    body: string,
    data?: Record<string, string>,
    options?: {
      imageUrl?: string;
      clickAction?: string;
    }
  ): NotificationPayload {
    return {
      title,
      body,
      data,
      imageUrl: options?.imageUrl,
      clickAction: options?.clickAction,
    };
  }
}

export { FirebaseService, NotificationPayload, SendNotificationOptions, NotificationResult };
export default FirebaseService;
