/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:02:01
 * @FilePath: /git/application_framework/src/app/middleware/verify.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
require('dotenv').config();
const statusHandler = require('@utils/status');

function getConfig() {
  const middleware = [];
  if (process.env.XSS === 'true') middleware.push(sanitizeInput);
  middleware.push(token);
  if (process.env.REQUEST_ENCRYPT === 'true') middleware.push(sign);
  return middleware;
}
const sanitizeInput = (req, res, next) => {
  function replaceSensitiveInfo(data) {
    const sensitiveWords = ['password', 'credit card', 'social security number', '密码', '身份证', '信用卡'];
    for (let word of sensitiveWords) {
      const regex = new RegExp(word, 'gi');
      data = data.replace(regex, '******');
    }
    return data;
  }
  function sanitizeData(data) {
    if (typeof data === 'object') {
      // 如果数据是对象，则递归处理每个属性
      for (let key in data) {
        data[key] = sanitizeData(data[key]);
      }
    } else if (typeof data === 'string') {
      // 如果数据是字符串，则应用过滤器
      // const xss = require('xss');
      // data = xss(data); // XSS 过滤
      data = data.trim().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, "''"); // SQL 转义单引号
      // data = path.normalize(data); // 路径规范化
      // data = replaceSensitiveInfo(data); // 敏感信息替换
    }
    return data;
  }
  if (req.body) {
    // 在这里对 req.body 进行过滤和验证
    // 例如，对每个属性应用适当的过滤器或验证器
    req.body = sanitizeData(req.body);
  }
  next();
}

const token = async (req, res, next) => {
  const secretsHelper = require('@helper/secrets');
  req.appId = req.headers['app-id'] || false;
  req.appSecret = req.headers['app-secret'] || false;
  const timeStamp = req.appSecret.toString().substring(32) || 0;
  if (!req.appId || !req.appSecret) {
    return statusHandler.set(res).dictionary(401000001).response();
  }
  if (timeStamp < Math.floor(Date.now() / 1000) - (process.env.TOKEN_TIME || 1800)) {
    return statusHandler.set(res).dictionary(401000002).response();
  }
  const secretRow = await secretsHelper.getAppId(req.appId);
  if (!secretRow?.app_id || !secretRow?.app_secret) {
    return statusHandler.set(res).dictionary(401000003).response();
  }
  if (!secretRow?.status) {
    return statusHandler.set(res).dictionary(401000004).response();
  }
  const cryptTool = require('@utils/cryptTool');
  const newSecret = cryptTool.md5(cryptTool.md5(secretRow.app_id.toString() + timeStamp.toString()) + secretRow.app_secret.toString()) + timeStamp.toString();
  if (req.appSecret !== newSecret) {
    return statusHandler.set(res).dictionary(401000005).response();
  }
  req.secretRow = secretRow;
  next();
};

const sign = async (req, res, next) => {
  if (process.env.REQUEST_ENCRYPT === 'true') {
    // req.appSign = req.headers['app-sign'] || false;
    const { iv, encryptedData } = req.body;
    const cryptTool = require('@utils/cryptTool');
    const decryptedData = cryptTool.decrypt(encryptedData, req.secretRow?.app_secret, iv);
    req.body = { ...decryptedData }; // Object.assign({}, decryptedData);
  }
  next();
};

const manageAuth = async (req, res, next) => {
  const accountssHelper = require('@helper/accountss');
  const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
  const cryptTool = require('@utils/cryptTool');
  const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
  if (!decryptedData?.token) {
    return statusHandler.set(res).dictionary(401000007).response();
  }
  if (process.env.NODE_ENV === 'production') { // 开发模式下跳过时间校验
    if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
      return statusHandler.set(res).dictionary(401000008).response();
    }
  }
  const accountsRow = await accountssHelper.getToken(decryptedData.token);
  if (!accountsRow?.id) {
    return statusHandler.set(res).dictionary(401000009).response();
  }
  if (!accountsRow?.status) {
    return statusHandler.set(res).dictionary(401000010).response();
  }
  req.currentaccounts = accountsRow;
  next();
};

const consoleAuth = async (req, res, next) => {
  const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
  const cryptTool = require('@utils/cryptTool');
  const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
  if (!decryptedData?.token) {
    return statusHandler.set(res).dictionary(401000011).response(encryptedToken.replace('Bearer ', ''));
  }
  if (process.env.NODE_ENV === 'production') { // 开发模式下跳过时间校验
    if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
      return statusHandler.set(res).dictionary(401000012).response();
    }
  }
  const processHelper = require('@helper/process');
  const result = await processHelper.accountsOperation(async (client) => {
    return await client.verifyToken(decryptedData.token);
  });
  if (!result || result.error) {
    return statusHandler.set(res).dictionary(401000013).response();
  }
  if (!result?.id) {
    return statusHandler.set(res).dictionary(401000014).response();
  }
  if (!result?.status) {
    return statusHandler.set(res).dictionary(401000015).response();
  }
  req.currentaccounts = result;
  next();
};

const frontAuth = async (req, res, next) => {
  
  const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
  const cryptTool = require('@utils/cryptTool');
  const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
  if (!decryptedData?.token) {
    return statusHandler.set(res).dictionary(401000016).response();
  }
  if (process.env.NODE_ENV === 'production') { // 开发模式下跳过时间校验
    if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
      return statusHandler.set(res).dictionary(401000017).response();
    }
  }
  const processHelper = require('@helper/process');
  const result = await processHelper.accountsOperation(async (client) => {
    return await client.verifyToken(decryptedData.token);
  });
  if (!result || result.error) {
    return statusHandler.set(res).dictionary(401000018).response(result.error);
  }
  if (!result?.id) {
    return statusHandler.set(res).dictionary(401000019).response();
  }
  if (!result?.status) {
    return statusHandler.set(res).dictionary(401000020).response();
  }
  req.currentaccounts = result;
  next();
};

module.exports = {
  getConfig,
  sanitizeInput,
  token,
  sign,
  manageAuth,
  consoleAuth,
  frontAuth
}