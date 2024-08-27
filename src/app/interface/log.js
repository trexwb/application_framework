/*** 
 * @Author: trexwb
 * @Date: 2024-03-13 12:12:05
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-20 18:48:04
 * @FilePath: /drive/src/app/cast/log.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
// log.js
const ALY = require('aliyun-sdk');

class LogService {
  constructor() {
    this.sls = null;
  }
  /**
   * 建立与SLS服务的连接
   * 如果this.sls已经存在，则直接返回this.sls
   * 否则，检查环境变量中是否设置了ALY_ACCESS_KEY_ID和ALY_ACCESS_KEY_SECRET
   * 如果没有设置，则抛出错误
   * 如果设置了，则使用这些环境变量初始化this.sls，并返回this.sls
   * 
   * @returns {ALY.SLS} 返回SLS服务的实例
   * @throws {Error} 如果环境变量中未设置ALY_ACCESS_KEY_ID和ALY_ACCESS_KEY_SECRET，则抛出错误
   */
  connection() {
    if (!this.sls) {
      if (!process.env.ALY_ACCESS_KEY_ID || !process.env.ALY_ACCESS_KEY_SECRET) {
        throw new Error('ALY_ACCESS_KEY_ID and ALY_ACCESS_KEY_SECRET must be set');
      }
      this.sls = new ALY.SLS({
        accessKeyId: process.env.ALY_ACCESS_KEY_ID,
        secretAccessKey: process.env.ALY_ACCESS_KEY_SECRET,
        endpoint: process.env.ALY_SLS_ENDPOINT || 'http://cn-hangzhou.log.aliyuncs.com',
        apiVersion: '2015-06-01'
      });
    }
    return this.sls;
  }
  /**
   * 根据日志类型、消息和数据向指定的日志服务项目和日志库中写入日志
   * 
   * @param {string} logType - 日志类型，如果未指定，默认为'error'
   * @param {string} msg - 需要记录的日志消息
   * @param {Object} data - 需要记录的日志数据，将被转换为JSON字符串
   * @param {string} ip - 日志的源IP地址，如果未指定，默认为'127.0.0.1'
   */
  putLogs(logType, msg, data, ip) {
    try {
      if (!process.env.ALY_ACCESS_KEY_ID || process.env.ALY_ACCESS_KEY_ID == '') {
        return;
      }
      const param = {
        projectName: process.env.ALY_SLS_PROJECT_NAME,
        logStoreName: process.env.ALY_SLS_LOG_STORE_NAME,
        logGroup: {
          logs: [{
            time: Math.floor(new Date().getTime() / 1000),
            contents: [{ key: logType || 'error', value: `${msg}:${JSON.stringify(data || {})}` }]
          }],
          topic: process.env.APP_NAME,
          source: ip || '127.0.0.1'
        }
      };
      this.connection().putLogs(param, function (err, data) {
        if (err) {
          console.error('error:', err)
        } else {
          console.log('写入日志成功', data)
        }
      });
    } catch (error) {
      console.error(`error:`, error);
      // Here can be added error retry logic or error reporting
    }
  }

  writeError(msg, data, ip) {
    // console.error(`error:`, msg, JSON.stringify(data || {}), ip);
    this.putLogs(`error[${process.env.NODE_ENV}]`, msg, data, ip);
  }

  writeInfo(msg, data) {
    this.putLogs(`info[${process.env.NODE_ENV}]`, msg, data);
  }
}

module.exports = new LogService();