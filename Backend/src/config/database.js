/**
 * Database Configuration - PostgreSQL with Connection Pooling
 * Architecture: PostgreSQL 14+ with PgBouncer-style connection pooling
 */

const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL Connection Pool Configuration
const pgConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fixrx_db',
  user: process.env.DB_USER || 'fixrx_user',
  password: process.env.DB_PASSWORD || 'fixrx_password',
  
  // Connection Pool Settings (PgBouncer-style)
  max: parseInt(process.env.DB_POOL_MAX) || 100, // Maximum connections
  min: parseInt(process.env.DB_POOL_MIN) || 10,  // Minimum connections
  idle: parseInt(process.env.DB_POOL_IDLE) || 10000, // 10 seconds
  acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 60000, // 60 seconds
  evict: parseInt(process.env.DB_POOL_EVICT) || 1000, // 1 second
  
  // Performance Settings
  statement_timeout: 30000, // 30 seconds
  query_timeout: 30000,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  
  // SSL Configuration
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

// Redis Configuration for Caching and Sessions
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
  db: process.env.REDIS_DB || 0,
  
  // Connection Settings
  connectTimeout: 10000,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  
  // Performance Settings
  maxmemory_policy: 'allkeys-lru',
  keyPrefix: 'fixrx:',
  
  // Cluster Configuration (for scaling)
  enableReadyCheck: true,
  maxRetriesPerRequest: null,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false
};

class DatabaseManager {
  constructor() {
    this.pgPool = null;
    this.redisClient = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      // Initialize PostgreSQL Pool
      this.pgPool = new Pool(pgConfig);
      
      // Test PostgreSQL connection
      const client = await this.pgPool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('✅ PostgreSQL Connected:', {
        timestamp: result.rows[0].current_time,
        version: result.rows[0].pg_version.split(' ')[0],
        poolSize: pgConfig.max
      });
      client.release();

      // Initialize Redis Client
      this.redisClient = redis.createClient(redisConfig);
      
      this.redisClient.on('connect', () => {
        console.log('✅ Redis Connected:', {
          host: redisConfig.host,
          port: redisConfig.port,
          db: redisConfig.db
        });
      });

      this.redisClient.on('error', (err) => {
        console.error('❌ Redis Error:', err);
      });

      await this.redisClient.connect();
      
      // Test Redis connection
      await this.redisClient.set('health_check', 'ok', { EX: 60 });
      const healthCheck = await this.redisClient.get('health_check');
      
      if (healthCheck === 'ok') {
        console.log('✅ Redis Health Check: Passed');
      }

      this.isConnected = true;
      
      // Setup connection monitoring
      this.setupMonitoring();
      
      return {
        postgresql: true,
        redis: true,
        poolSize: pgConfig.max,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Database Initialization Failed:', error);
      throw error;
    }
  }

  setupMonitoring() {
    // PostgreSQL Pool Monitoring
    this.pgPool.on('connect', (client) => {
      console.log('📊 PostgreSQL: New client connected');
    });

    this.pgPool.on('remove', (client) => {
      console.log('📊 PostgreSQL: Client removed from pool');
    });

    this.pgPool.on('error', (err, client) => {
      console.error('❌ PostgreSQL Pool Error:', err);
    });

    // Periodic health checks
    setInterval(async () => {
      try {
        const poolStats = {
          totalCount: this.pgPool.totalCount,
          idleCount: this.pgPool.idleCount,
          waitingCount: this.pgPool.waitingCount
        };
        
        console.log('📊 PostgreSQL Pool Stats:', poolStats);
        
        // Redis health check
        const redisInfo = await this.redisClient.info('memory');
        console.log('📊 Redis Memory Usage:', redisInfo.split('\n')[1]);
        
      } catch (error) {
        console.error('❌ Health Check Failed:', error);
      }
    }, 60000); // Every minute
  }

  // PostgreSQL Query Methods
  async query(text, params = []) {
    const start = Date.now();
    try {
      const result = await this.pgPool.query(text, params);
      const duration = Date.now() - start;
      
      console.log('📊 Query executed:', {
        duration: `${duration}ms`,
        rows: result.rowCount,
        command: text.split(' ')[0]
      });
      
      return result;
    } catch (error) {
      console.error('❌ Query Error:', {
        error: error.message,
        query: text,
        params
      });
      throw error;
    }
  }

  async transaction(callback) {
    const client = await this.pgPool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Redis Cache Methods
  async setCache(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redisClient.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('❌ Cache Set Error:', error);
      return false;
    }
  }

  async getCache(key) {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ Cache Get Error:', error);
      return null;
    }
  }

  async deleteCache(key) {
    try {
      await this.redisClient.del(key);
      return true;
    } catch (error) {
      console.error('❌ Cache Delete Error:', error);
      return false;
    }
  }

  async flushCache(pattern = '*') {
    try {
      const keys = await this.redisClient.keys(`${redisConfig.keyPrefix}${pattern}`);
      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
      return keys.length;
    } catch (error) {
      console.error('❌ Cache Flush Error:', error);
      return 0;
    }
  }

  // Geographic Search Utilities
  calculateBoundingBox(lat, lng, radiusKm) {
    const earthRadiusKm = 6371;
    const latDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI);
    const lngDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {
      minLat: lat - latDelta,
      maxLat: lat + latDelta,
      minLng: lng - lngDelta,
      maxLng: lng + lngDelta
    };
  }

  async findVendorsInRadius(lat, lng, radiusKm, serviceCategories = []) {
    const bbox = this.calculateBoundingBox(lat, lng, radiusKm);
    
    let query = `
      SELECT v.*, u.first_name, u.last_name, u.email,
             ABS(v.latitude - $1) + ABS(v.longitude - $2) as distance_approx
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      WHERE v.latitude BETWEEN $3 AND $4
        AND v.longitude BETWEEN $5 AND $6
        AND v.status = 'active'
    `;
    
    const params = [lat, lng, bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng];
    
    if (serviceCategories.length > 0) {
      query += ` AND v.service_categories && $${params.length + 1}`;
      params.push(serviceCategories);
    }
    
    query += ` ORDER BY distance_approx LIMIT 50`;
    
    return await this.query(query, params);
  }

  // Connection Status
  getStatus() {
    return {
      connected: this.isConnected,
      postgresql: {
        totalConnections: this.pgPool?.totalCount || 0,
        idleConnections: this.pgPool?.idleCount || 0,
        waitingConnections: this.pgPool?.waitingCount || 0
      },
      redis: {
        status: this.redisClient?.status || 'disconnected',
        connected: this.redisClient?.isReady || false
      }
    };
  }

  async close() {
    try {
      if (this.pgPool) {
        await this.pgPool.end();
        console.log('✅ PostgreSQL Pool Closed');
      }
      
      if (this.redisClient) {
        await this.redisClient.quit();
        console.log('✅ Redis Connection Closed');
      }
      
      this.isConnected = false;
    } catch (error) {
      console.error('❌ Database Close Error:', error);
    }
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

module.exports = {
  DatabaseManager,
  dbManager,
  pgConfig,
  redisConfig
};
