/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-01 09:24:57
 * @FilePath: /drive/src/app/middleware/response.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// require('dotenv').config();
// console.log(process.env.NODE_ENV, process.env);
// const cacheCast = require('@cast/cache');
// const databaseCast = require('@cast/database');
'use strict';

module.exports = {
  factory: async (req, res, next) => {
    req.body = Object.assign({}, req.body) // JSON.parse(JSON.stringify(req.body));
    req.msg = null;
    req.app = app;
    req.data = null;
    // 注册事件
    const eventEmitter = require('@event/index');
    req.eventEmitter = eventEmitter;
    // 全局错误处理
    req.handleError = (code, error, write = false) => {
      req.code = code || 200;
      req.msg = error ? error.toString() : null;
      if ((write || String(code).startsWith('500')) && req.msg) {
        // 日志使用
        const logCast = require('@cast/log');
        const forwardedFor = req.headers['x-forwarded-for'] || '';
        const ip = forwardedFor.split(',')[0] || req.ip;
        req.realIP = ip;
        logCast.writeError(req.msg, { ...req.headers, ...req.body }, req.realIP);
      }
      return this.build(req, res, next);
    }
    // 全局响应
    req.handleResponse = () => {
      return this.build(req, res, next);
    }
    next();
  },
  build: async (req, res, next) => {
    const utils = require('@utils/index');
    const cryptTool = require('@utils/cryptTool');
    const status = require('@utils/status');
    let stream = {};
    const msgMap = status.msgMap;
    const dictionary = (code) => {
      stream = {
        msg: req.msg || (msgMap[code] || 'unknown error'),
        code: code
      }
      return 200;
      // return Number((code || 0).toString().substring(0, 3) || 200);
    };
    const response = (data) => {
      if (data) {
        stream.data = JSON.parse(JSON.stringify(data));
        if (stream.data.length <= 0) {
          delete stream.data;
        }
      }
      return stream || false;
    }
    // try {
    //   // 销毁服务前关闭数据库
    //   const cacheCast = require('@cast/cache');
    //   cacheCast.destroy();
    // } catch (e) { }
    // try {
    //   // 销毁服务前关闭数据库
    //   const databaseCast = require('@cast/database');
    //   databaseCast.destroy();
    // } catch (e) { }
    if (req.currentAccount?.remember_token) { // 当前用户如果存在就返回新的token
      let token = {
        token: req.currentAccount?.remember_token || '',
        timeStamp: Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_TIME)
      };
      res.header('Auth-Token', cryptTool.encrypt(token, req.secretRow?.app_secret, process.env.APP_KEY));
    }
    if (req.data && process.env.RETURN_ENCRYPT === 'true') {
      try {
        // 加密后响应
        const key = req.secretRow?.app_secret || '';
        const iv = utils.generateRandomString(16);
        const encryptedText = cryptTool.encrypt(req.data, key, iv);
        return res.status(dictionary(req.code || 200)).send(response({
          iv: iv,
          encryptedData: encryptedText
        }));
        // 解密数据
        // const decryptedData = cryptTool.decrypt(encryptedText, key, iv) // cryptTool.decrypt(encryptedText, key, Buffer.from(iv.toString('hex'), 'hex'));
        // console.log(encryptedText, ':解密后的数据:', decryptedData);
      } catch (error) {
        return res.status(400).send(error);
      }
    } else {
      // 常规返回
      return res.status(dictionary(req.code || 200)).send(response(req.data || false));
    }
  }
}