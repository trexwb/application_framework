/*** 
 * @Author: trexwb
 * @Date: 2024-04-03 11:27:37
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-19 15:16:22
 * @FilePath: /drive/src/app/route/front/caajwcPrint.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

const caajwcPrintVerifyAuth = async (req, res, next) => {
  const status = require('@utils/status');
  const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
  const cryptTool = require('@utils/cryptTool');
  const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
  if (!decryptedData || !decryptedData.token) {
    return status.set(res).dictionary(401005001).response(encryptedToken.replace('Bearer ', ''));
  }
  if (process.env.NODE_ENV === 'production') { // 开发模式下跳过时间校验
    if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
      return status.set(res).dictionary(401005002).response();
    }
  }
  const processHelper = require('@helper/process');
  const result = await processHelper.caajwcPrintOperation(async (client) => {
    return await client.usersDetail(decryptedData.token); // 通过tokenExchange换取的id
  }, req.siteId || siteId);
  if (!result || result.error) {
    return status.set(res).dictionary(401005003).response();
  }
  if (!result?.id) {
    return status.set(res).dictionary(401005004).response();
  }
  if (!result?.status) {
    return status.set(res).dictionary(401005005).response();
  }
  req.currentAccount = {
    ...result,
    remember_token: result.id || 0,
  };
  return next();
};

// 教师或学生信息兑换令牌
router.post(`/:fn(tokenExchange|certificate)`, async (req, res, next) => {
  const { fn } = req.params;
  /**
   * 回路逻辑
   * 教务系统携带token打开内嵌地址
   * 内嵌地址携带token调用本接口换取教务系统内的用户信息
   */
  if (fn === 'tokenExchange') {
    const signController = require('@controller/caajwcPrint/sign');
    req.data = await signController.tokenExchange(req, res, next);
  } else if (fn === 'certificate') {
    const verifyController = require('@controller/caajwcPrint/verify');
    req.data = await verifyController.certificate(req, res, next);
  }
  return next();
});

const singArray = ['signInfo', 'signOut'];
const goodsArray = ['goodsDetail'];
// const templatesArray = ['templatesList', 'templatesDetail'];
const ordersArray = ['ordersCreate', 'ordersClose', 'ordersPayment', 'ordersList', 'ordersDetail'];
const refundsArray = ['refundsList', 'refundsDetail', 'refundsRequest'];

router.post(`/:fn(${[...singArray, ...goodsArray, ...ordersArray, ...refundsArray].join('|')})`, caajwcPrintVerifyAuth, async (req, res, next) => {
  const { fn } = req.params;
  let controllerPath = '';
  if (singArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/sign';
  } else if (goodsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/userGoods';
    // } else if (templatesArray.includes(fn)) {
    //   controllerPath = '@controller/caajwcPrint/userTemplates';
  } else if (ordersArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/userOrders';
  } else if (refundsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/userRefunds';
  }
  const controller = require(controllerPath);
  req.data = await controller[fn](req, res, next);
  return next();
});

module.exports = router;