/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 11:39:53
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:00:59
 * @FilePath: /git/application_framework/src/app/interface/database.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
require('dotenv').config();
const knex = require('knex');
const knexConfig = require('@config/knex');
// const logInterface = require('@interface/log');

// const dbRead = knex(knexConfig.read);
// const dbWrite = knex(knexConfig.write);

module.exports = {
  clientWrite: null,
  clientRead: null,
  prefix: process.env.DB_PREFIX || '',
  // 检查并销毁无效的连接池
  async destroyIfInvalid(client, isWrite = false) {
    try {
      if (!client || !client.context?.client?.pool) {
        if (client) {
          await client.destroy();
        }
        return knex(isWrite ? knexConfig.write : knexConfig.read);
      }
      return client;
    } catch (error) {
      console.error(`Error checking or destroying invalid connection: ${error}`);
      throw error; // 抛出异常以便上层处理
    }
  },
  // 获取写数据库连接
  async dbWrite() {
    if (!this.clientWrite) {
      this.clientWrite = await this.destroyIfInvalid(this.clientWrite, true);
    }
    return this.clientWrite;
  },

  // 获取读数据库连接
  async dbRead() {
    if (!this.clientRead) {
      this.clientRead = await this.destroyIfInvalid(this.clientRead, false);
    }
    return this.clientRead;
  },
  // 销毁数据库连接
  async destroy() {
    try {
      if (this.clientWrite) await this.clientWrite.destroy();
      if (this.clientRead) await this.clientRead.destroy();
    } catch (error) {
      console.log(`Error destroying Mysql connections: ${error}`);
    } finally {
      this.clientWrite = null;
      this.clientRead = null;
    }
  }
}
