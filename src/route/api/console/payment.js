/*** 
 * @Author: trexwb
 * @Date: 2024-06-18 09:29:30
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-18 14:16:39
 * @FilePath: /drive/src/app/route/console/payment.js
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

const configsArray = ['configsList', 'configsDetail', 'configsSave', 'configsEnable', 'configsDisable'];
const platformsArray = ['platformsAll'];

// 自定义相关
router.post(`/:fn(${[...configsArray, ...platformsArray].join('|')})`, verifyMiddleware.consoleAuth, async (req, res, next) => {
  const { fn } = req.params;
  if (configsArray.includes(fn) && req.currentAccount.roles.includes('paymentConfigs')) {
    const configsController = require('@controller/payment/configs');
    if (['configsList', 'configsDetail'].includes(fn) && req.currentAccount.permissions.includes('paymentConfigs:read')) {
      req.data = await configsController[fn](req, res, next);
    } else if (['configsSave', 'configsEnable', 'configsDisable'].includes(fn) && req.currentAccount.permissions.includes('paymentConfigs:write')) {
      req.data = await configsController[fn](req, res, next);
    } else {
      return req.handleError(401041001, 'roles not permissions');
    }
  } else if (platformsArray.includes(fn) && req.currentAccount.roles.includes('paymentPlatforms')) {
    const platformsController = require('@controller/payment/platforms');
    if (['platformsAll'].includes(fn) && req.currentAccount.permissions.includes('paymentPlatforms:read')) {
      req.data = await platformsController[fn](req, res, next);
    } else {
      return req.handleError(401041002, 'roles not permissions');
    }
  } else {
    return req.handleError(401041003, 'roles not permissions');
  }
  return next();
});

module.exports = router;