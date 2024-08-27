/*** 
 * @Author: trexwb
 * @Date: 2024-04-03 11:27:37
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-19 10:00:05
 * @FilePath: /drive/src/app/route/store/caajwcPrint.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const status = require('@utils/status');
const express = require('express');
const router = express.Router();

const caajwcPrintVerifyAuth = async (req, res, next) => {
  try {
    const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
    const cryptTool = require('@utils/cryptTool');
    const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
    if (!decryptedData?.token) {
      return status.set(res).dictionary(401037001).response(encryptedToken.replace('Bearer ', ''));
    }
    if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
      return status.set(res).dictionary(401037002).response();
    }
    const processHelper = require('@helper/process');
    const result = await processHelper.caajwcPrintOperation(async (client) => {
      return await client.verifyToken(decryptedData.token);
    }, req.siteId || siteId);
    if (!result || result.error) {
      return status.set(res).dictionary(401037003).response();
    }
    if (!result?.id) {
      return status.set(res).dictionary(401037004).response();
    }
    if (!result?.status) {
      return status.set(res).dictionary(401037005).response();
    }
    req.currentAccount = result;
    return next();
  } catch (error) {
    return status.set(res).dictionary(500037001).response();
  }
};

// 打印店账号登录
router.post(`/:fn(signIn|signSecret)`, async (req, res, next) => {
  const { fn } = req.params;
  const signController = require('@controller/caajwcPrint/sign');
  req.data = await signController[fn](req, res, next);
  return next();
});

const singArray = ['signInfo', 'signOut'];
const statisticsArray = ['statisticsAll'];
const templatesArray = ['templatesList', 'templatesDetail'];
const storesArray = ['storesList', 'storesDetail'];
const ordersArray = ['ordersList', 'ordersDetail', 'ordersExpress'];
const refundsArray = ['refundsList', 'refundsDetail'];
const batchesArray = ['batchesList', 'batchesDetail', 'batchesCreate', 'batchesStatus'];
const settlementsArray = ['settlementsList', 'settlementsDetail'];

router.post(`/:fn(${[...singArray, ...statisticsArray, ...templatesArray, ...ordersArray, ...refundsArray, ...batchesArray, ...settlementsArray].join('|')})`, caajwcPrintVerifyAuth, async (req, res, next) => {
  const { fn } = req.params;
  let controllerPath = '';
  if (singArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/sign';
  } else if (statisticsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeStatistics';
  } else if (templatesArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeTemplates';
  } else if (storesArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeStores';
  } else if (ordersArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeOrders';
  } else if (refundsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeRefunds';
  } else if (batchesArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeBatches';
  } else if (settlementsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/stroeSettlements';
  } else {
    return req.handleError(401037006, 'roles not permissions');
  }
  const controller = require(controllerPath);
  req.data = await controller[fn](req, res, next);
  return next();
});

module.exports = router;