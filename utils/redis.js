const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: 'host',
      port: 'port',
      password: 'password',
    });

    this.client.on('error', (err) => {
      console.log(`Redis connection to ${this.client.host}:${this.client.port} unsuccessful: ${err.message}`);

      this.client.quit();
    });

    this.client.on('connect', () => {
      console.log(`Redis connection to ${this.client.host}:${this.client.port} successful`);
    });

    this.client.on('end', () => {
      console.log(`Redis connection to ${this.client.host}:${this.client.port} ended`);

      this.client.quit();
    });
  }

  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  async get(key) {
    const value = promisify(this.client.get).bind(this.client);
    try {
      const result = await value(key);
      return result;
    } catch (error) {
      console.log(`Error getting value of ${key}: ${error}`);
      return null;
    }
  }

  async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    try {
      const result = await setAsync(key, value, 'EX', duration);
      return result;
    } catch (error) {
      console.log(`Error setting value of ${key}: ${error}`);
      return null;
    }
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    try {
      const result = await delAsync(key);
      return result;
    } catch (error) {
      console.log(`Error deleting value of ${key}: ${error}`);
      return null;
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
