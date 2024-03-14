/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-13 15:47:42
 * @FilePath: /laboratory/application/drive/src/app/cast/cache.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
const redis = require('redis');
const redisConfig = require('@config/redis');
const logCast = require('@cast/log');

/**
 * Redis客户端封装，包含连接管理、设置、获取、删除缓存等操作
 */
module.exports = {
  client: null,
  create: async function () {
    if (!this.client) {
      try {
        this.client = await redis.createClient({
          password: redisConfig.password || '',
          socket: {
            host: redisConfig.host || '',
            port: redisConfig.port || '',
          },
          database: redisConfig.db || 1,
        });
        await this.client.connect();
      } catch (error) {
        logCast.writeError(`Error initializing Redis client: ${error}`);
        // 重新抛出异常，以便调用者可以捕获并进行进一步处理
        throw error;
      }
    }
    return this.client;
  },

  set: async function (key, value, expireTime) {
    await this.create();
    try {
      await this.client.set(redisConfig.prefix + key, JSON.stringify(value));
      if (expireTime) {
        await this.client.expire(redisConfig.prefix + key, expireTime);
      }
    } catch (error) {
      logCast.writeError(`Error setting Redis value: ${error}`);
      return false;
    }
  },

  get: async function (key) {
    await this.create();
    try {
      const value = await this.client.get(redisConfig.prefix + key);
      return value ? JSON.parse(value) : null; // 处理未找到键值的场景，返回null而不是false
    } catch (error) {
      logCast.writeError(`Error getting Redis value: ${error}`);
      return false;
    }
  },

  del: async function (key) {
    await this.create();
    try {
      await this.client.del(redisConfig.prefix + key);
    } catch (error) {
      logCast.writeError(`Error deleting Redis key: ${error}`);
      return false;
    }
  },

  setCacheWithTags: async function (tags, key, value) {
    if (!value) return;
    await this.create();
    try {
      await Promise.all([
        this.client.sAdd(`${redisConfig.prefix}tag:${tags}`, redisConfig.prefix + key),
        this.client.set(redisConfig.prefix + key, JSON.stringify(value))
      ]);
    } catch (error) {
      logCast.writeError(`Error setting cache with tags: ${error}`);
      return false;
    }
  },

  clearCacheByTag: async function (tag) {
    await this.create();
    try {
      const keys = await this.client.sMembers(`${redisConfig.prefix}tag:${tag}`);
      await Promise.all(keys.map(async (key) => {
        await this.client.del(key);
      }));
      await this.client.del(`${redisConfig.prefix}tag:${tag}`);
    } catch (error) {
      logCast.writeError(`Error clearing cache by tag: ${error}`);
      return false;
    }
  },

  destroy: async function () {
    if (this.client) {
      try {
        await this.client.quit();
        this.client = null;
      } catch (error) {
        logCast.writeError(`Error destroying Redis client: ${error}`);
        return false;
      }
    }
  }
};