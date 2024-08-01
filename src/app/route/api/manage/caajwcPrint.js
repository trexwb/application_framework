/*** 
 * @Author: trexwb
 * @Date: 2024-03-27 18:02:42
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:08:49
 * @FilePath: /drive/src/app/route/manage/caajwcPrint.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

const verifyMiddleware = require('@middleware/verify');

// 非授权登录
// router.post(`/:fn(signIn|signSecret)`, async (req, res, next) => {
//   const { fn } = req.params;
//   const signController = require('@controller/caajwcPrint/sign');
//   req.data = await signController[fn](req, res, next);
//   return next();
// });

const usersArray = ['usersList', 'usersDetail', 'usersSave', 'usersEnable', 'usersDisable', 'usersRestore', 'usersDelete'];
// const templatesArray = ['templatesList', 'templatesDetail', 'templatesSave', 'templatesEnable', 'templatesDisable'];
const goodsArray = ['goodsList', 'goodsDetail', 'goodsSave', 'goodsEnable', 'goodsDisable', 'goodsRestore', 'goodsDelete'];
const storesArray = ['storesList', 'storesDetail', 'storesSave', 'storesEnable', 'storesDisable', 'storesRestore', 'storesDelete'];
const ordersArray = ['ordersList', 'ordersDetail', 'ordersCreate', 'ordersQuery', 'ordersClose', 'ordersStatus'];
const refundsArray = ['refundsList', 'refundsDetail', 'refundsRequest', 'refundsStatus'];
const batchesArray = ['batchesList', 'batchesDetail', 'batchesSave', 'batchesCreate', 'batchesStatus'];
const settlementsArray = ['settlementsList', 'settlementsDetail', 'settlementsCreate', 'settlementsStatus'];

// 自定义相关
router.post(`/:fn(${[...usersArray, ...goodsArray, ...storesArray, ...ordersArray, ...refundsArray, ...batchesArray, ...settlementsArray].join('|')})`, verifyMiddleware.manageAuth, async (req, res, next) => {
  const { fn } = req.params;
  let controllerPath = '';
  if (usersArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleUsers';
  } else if (goodsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleGoods';
    // } else if (templatesArray.includes(fn)) {
    //   controllerPath = '@controller/caajwcPrint/consoleTemplates';
  } else if (storesArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleStores';
  } else if (ordersArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleOrders';
  } else if (refundsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleRefunds';
  } else if (batchesArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleBatches';
  } else if (settlementsArray.includes(fn)) {
    controllerPath = '@controller/caajwcPrint/consoleSettlements';
  }
  const controller = require(controllerPath);
  req.data = await controller[fn](req, res, next);
  return next();
});

module.exports = router;