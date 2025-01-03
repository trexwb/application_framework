/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:01:48
 * @FilePath: /git/application_framework/src/app/middleware/response.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
require('dotenv').config();
const _ = require('lodash');
const logInterface = require('@interface/log');
const utils = require('@utils/index');
const cryptTool = require('@utils/cryptTool');
const status = require('@utils/status');
const eventEmitter = require('@event/index');

// const cacheInterface = require('@interface/cache');
// const dbInterface = require('@interface/database');

const middlewareResponse = {
  factory: async (req, res, next) => {
    // req.body = _.cloneDeep(req.body); // JSON.parse(JSON.stringify(req.body));
    req.msg = null;
    req.data = null;
    // 注册事件
    req.eventEmitter = eventEmitter;
    // 全局错误处理
    req.handleError = (code, error, write = false) => {
      req.code = code || 200;
      req.msg = error ? error.toString() : null;
      if ((write || String(code).startsWith('500')) && req.msg) {
        // 日志使用
        const forwardedFor = req.headers['x-forwarded-for'] || '';
        const ip = forwardedFor.split(',')[0] || req.ip;
        req.realIP = ip;
        logInterface.writeError(req.msg, { ...req.headers, ...req.body }, req.realIP);
      }
      middlewareResponse.build(req, res, next);
    }
    // 全局响应
    req.handleResponse = () => {
      middlewareResponse.build(req, res, next);
    }
    next();
  },
  build: async (req, res, next) => {
    const msgMap = status.msgMap;
    let stream = { msg: '', code: 200, data: null };

    const dictionary = (code) => {
      stream.msg = req.msg || (msgMap[code] || 'unknown error');
      stream.code = code || 200;
      return stream.code;
    };

    const response = (data) => {
      if (data) {
        if (Array.isArray(data) && data.length === 0) {
          stream.data = null;
        } else {
          stream.data = _.cloneDeep(data); // JSON.parse(JSON.stringify(data));
        }
      }
      return stream;
    }
    if (req.currentaccounts?.remember_token) {
      // 当前用户如果存在就返回新的token
      try {
        let token = {
          token: req.currentaccounts?.remember_token,
          timeStamp: Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_TIME || 1800)
        };
        res.header('Auth-Token', cryptTool.encrypt(token, req.secretRow?.app_secret || '', process.env.APP_KEY || ''));
      } catch (error) {
        console.error('Error generating token:', error);
      }
    }
    if (req.data && process.env.RETURN_ENCRYPT === 'true') {
      try {
        // 加密后响应
        const key = req.secretRow?.app_secret || '';
        const iv = utils.generateRandomString(16);
        if (!key || !iv) {
          throw new Error('Invalid key or iv');
        }
        const encryptedText = cryptTool.encrypt(req.data, key, iv);
        return res.status(dictionary(req.code || 200)).send(response({
          iv: iv,
          encryptedData: encryptedText
        }));
        // 解密数据
        // const decryptedData = cryptTool.decrypt(encryptedText, key, iv) // cryptTool.decrypt(encryptedText, key, Buffer.from(iv.toString('hex'), 'hex'));
        // console.log(encryptedText, ':解密后的数据:', decryptedData);
      } catch (error) {
        return res.status(400).send({ msg: 'Encryption failed', code: 400 });
      }
    } else {
      // 常规返回
      return res.status(dictionary(req.code || 200)).send(response(req.data));
    }
  }
}

module.exports = middlewareResponse