/*** 
 * @Author: trexwb
 * @Date: 2024-07-04 10:51:09
 * @LastEditors: trexwb
 * @LastEditTime: 2024-07-31 10:11:44
 * @FilePath: /drive/src/app/route/web/test.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const express = require('express');
const router = express.Router();

router.get('/event', async function (req, res) {
  req.eventEmitter.emit('testListener', req.query);
  res.status(200).send('ok');
});

router.get('/email', async function (req, res) {
  const hprose = require("hprose");
  const crypto = require('crypto');
  const md5 = (str) => {
    const md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
  }

  // 加密函数
  const encrypt = (encryptedData, key, iv) => {
    try {
      const encryptedText = JSON.stringify(encryptedData);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(encryptedText, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      return false;
    }
  }
  // 解密函数
  const decrypt = (encryptedText, key, iv) => {
    try {
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      return false;
    }
  }

  const siteId = '1';
  const appId = '8968382174234882';
  const appSecret = 'NxFRJDov0h54bludLxpU1Txj63bSDl9l';
  const getClient = await hprose.Client.create('http://127.0.0.1:3005');
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  const newSecret = md5(md5(appId.toString() + timeStamp) + appSecret.toString()) + timeStamp

  getClient.setHeader("App-Id", appId);
  getClient.setHeader("App-Secret", newSecret);
  getClient.setHeader("Site-Id", siteId);

  const proxy = await getClient.useService();
  const rpcFuns = await proxy.rpc_getFunctions();
  const result = await proxy.configsList({}, null, 1, 10);
  if (result && result.encryptedData && result.iv) {
    result = decrypt(result.encryptedData, appSecret, result.iv);
  }
  // console.log(rpcFuns, result);
  res.status(200).send({
    rpcFuns, result
  });
});

module.exports = router;