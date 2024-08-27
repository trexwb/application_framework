/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 11:58:20
 * @FilePath: //application_framework/src/app/cast/cache.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const cacheInterface = require('@interface/cache');

class CastCache {
  constructor() {
    this.cache = cacheInterface;
  }

  get(key, defaultVal = null) {
    const value = this.cache.get(key);
    return value !== undefined ? value : defaultVal;
  }

  set(key, value, ttl = null) {
    if (ttl !== null) {
      this.cache.set(key, value, ttl);
    } else {
      this.cache.set(key, value);
    }
  }

  del(key) {
    this.cache.del(key);
  }

  setCacheWithTags(tags, key, value) {
    this.cache.del(tags, key, value);
  }

  clearCacheByTag(tag) {
    return this.cache.clearCacheByTag(tag);
  }

  destroy() {
    return this.cache.destroy();
  }
}

module.exports = new CastCache();