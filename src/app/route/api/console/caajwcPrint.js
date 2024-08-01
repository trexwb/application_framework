/*** 
 * @Author: trexwb
 * @Date: 2024-03-27 18:06:39
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:00:09
 * @FilePath: /drive/src/app/route/console/caajwcPrint.js
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
const goodsArray = ['goodsList', 'goodsDetail', 'goodsSave', 'goodsEnable', 'goodsDisable'];
const templatesArray = ['templatesList', 'templatesDetail', 'templatesSave', 'templatesEnable', 'templatesDisable'];
const storesArray = ['storesList', 'storesDetail', 'storesSave', 'storesEnable', 'storesDisable', 'storesRestore', 'storesDelete'];
const ordersArray = ['ordersList', 'ordersDetail', 'ordersCreate', 'ordersQuery', 'ordersClose', 'ordersStatus'];
const refundsArray = ['refundsList', 'refundsDetail', 'refundsRequest', 'refundsStatus'];
const batchesArray = ['batchesList', 'batchesDetail', 'batchesSave', 'batchesCreate', 'batchesStatus'];
const settlementsArray = ['settlementsList', 'settlementsDetail', 'settlementsCreate', 'settlementsStatus'];

// 自定义相关
router.post(`/:fn(${[...usersArray, ...goodsArray, ...templatesArray, ...storesArray, ...ordersArray, ...refundsArray, ...batchesArray, ...settlementsArray].join('|')})`, verifyMiddleware.consoleAuth, async (req, res, next) => {
  const { fn } = req.params;
  if (usersArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintUsers')) {
    const usersController = require('@controller/caajwcPrint/consoleUsers');
    if (['usersList', 'usersDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintUsers:read')) {
      req.data = await usersController[fn](req, res, next);
    } else if (['usersSave', 'usersEnable', 'usersDisable'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintUsers:write')) {
      req.data = await usersController[fn](req, res, next);
    } else if (['usersRestore', 'usersDelete'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintUsers:delete')) {
      req.data = await usersController[fn](req, res, next);
    } else {
      return req.handleError(401004001, 'roles not permissions');
    }
  } else if (goodsArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintGoods')) {
    const goodsController = require('@controller/caajwcPrint/consoleGoods');
    if (['goodsList', 'goodsDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintGoods:read')) {
      req.data = await goodsController[fn](req, res, next);
    } else if (['goodsSave', 'goodsEnable', 'goodsDisable'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintGoods:write')) {
      req.data = await goodsController[fn](req, res, next);
    } else {
      return req.handleError(401004002, 'roles not permissions');
    }
  } else if (templatesArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintTemplates')) {
    const templatesController = require('@controller/caajwcPrint/consoleTemplates');
    if (['templatesList', 'templatesDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintTemplates:read')) {
      req.data = await templatesController[fn](req, res, next);
    } else if (['templatesSave', 'templatesEnable', 'templatesDisable'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintTemplates:write')) {
      req.data = await goodsController[fn](req, res, next);
    } else {
      return req.handleError(401004002, 'roles not permissions');
    }
  } else if (storesArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintStores')) {
    const storesController = require('@controller/caajwcPrint/consoleStores');
    if (['storesList', 'storesDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintStores:read')) {
      req.data = await storesController[fn](req, res, next);
    } else if (['storesSave', 'storesEnable', 'storesDisable'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintStores:write')) {
      req.data = await storesController[fn](req, res, next);
    } else if (['storesRestore', 'storesDelete'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintStores:delete')) {
      req.data = await storesController[fn](req, res, next);
    } else {
      return req.handleError(401004003, 'roles not permissions');
    }
  } else if (ordersArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintOrders')) {
    const ordersController = require('@controller/caajwcPrint/consoleOrders');
    if (['ordersList', 'ordersDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintOrders:read')) {
      req.data = await ordersController[fn](req, res, next);
    } else if (['ordersStatus'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintOrders:write')) {
      req.data = await ordersController[fn](req, res, next);
    } else {
      return req.handleError(401004004, 'roles not permissions');
    }
  } else if (refundsArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintRefunds')) {
    const refundsController = require('@controller/caajwcPrint/consoleRefunds');
    if (['refundsList', 'refundsDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintRefunds:read')) {
      req.data = await refundsController[fn](req, res, next);
    } else if (['ordersStatus'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintRefunds:write')) {
      req.data = await refundsController[fn](req, res, next);
    } else {
      return req.handleError(401004005, 'roles not permissions');
    }
  } else if (batchesArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintBatches')) {
    const batchesController = require('@controller/caajwcPrint/consoleBatches');
    if (['batchesList', 'batchesDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintBatches:read')) {
      req.data = await batchesController[fn](req, res, next);
    } else if (['batchesSave', 'batchesCreate', 'batchesStatus'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintBatches:write')) {
      req.data = await batchesController[fn](req, res, next);
    } else {
      return req.handleError(401004006, 'roles not permissions');
    }
  } else if (settlementsArray.includes(fn) && req.currentAccount.roles.includes('caajwcPrintSettlements')) {
    const settlementsController = require('@controller/caajwcPrint/consoleSettlements');
    if (['settlementsList', 'settlementsDetail'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintSettlements:read')) {
      req.data = await settlementsController[fn](req, res, next);
    } else if (['settlementsCreate', 'settlementsStatus'].includes(fn) && req.currentAccount.permissions.includes('caajwcPrintSettlements:write')) {
      req.data = await settlementsController[fn](req, res, next);
    } else {
      return req.handleError(401004007, 'roles not permissions');
    }
  } else {
    return req.handleError(401004008, 'roles not permissions');
  }
  return next();
});

module.exports = router;