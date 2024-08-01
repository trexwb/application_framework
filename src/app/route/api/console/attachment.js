/*** 
 * @Author: trexwb
 * @Date: 2024-02-27 19:18:20
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-18 09:36:26
 * @FilePath: /drive/src/app/route/console/attachment.js
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

const signArray = ['getSign', 'notify'];
const configsArray = ['configsList', 'configsDetail', 'configsSave', 'configsEnable', 'configsDisable', 'configsDelete'];
const filesArray = ['filesList', 'filesDetail', 'filesSave', 'filesSort', 'filesEnable', 'filesDisable', 'filesRestore', 'filesDelete'];

// 自定义相关
router.post(`/:fn(${[...signArray, ...configsArray, ...filesArray].join('|')})`, verifyMiddleware.consoleAuth, async (req, res, next) => {
  const { fn } = req.params;
  if (signArray.includes(fn)) {
    const signController = require('@controller/attachment/sign');
    req.data = await signController[fn](req, res, next);
  } else if (configsArray.includes(fn) && req.currentAccount.roles.includes('attachmentConfigs')) {
    const configsController = require('@controller/attachment/configs');
    if (['configsList', 'configsDetail'].includes(fn) && req.currentAccount.permissions.includes('attachmentConfigs:read')) {
      req.data = await configsController[fn](req, res, next);
    } else if (['configsSave', 'configsEnable', 'configsDisable'].includes(fn) && req.currentAccount.permissions.includes('attachmentConfigs:write')) {
      req.data = await configsController[fn](req, res, next);
    } else if (['configsDelete'].includes(fn) && req.currentAccount.permissions.includes('attachmentConfigs:delete')) {
      req.data = await configsController[fn](req, res, next);
    } else {
      return req.handleError(401001001, 'roles not permissions');
    }
  } else if (filesArray.includes(fn) && req.currentAccount.roles.includes('attachmentFiles')) {
    const filesController = require('@controller/attachment/files');
    if (['filesList', 'filesDetail'].includes(fn) && req.currentAccount.permissions.includes('attachmentFiles:read')) {
      req.data = await filesController[fn](req, res, next);
    } else if (['filesSave', 'filesSort', 'filesEnable', 'filesDisable'].includes(fn) && req.currentAccount.permissions.includes('attachmentFiles:write')) {
      req.data = await filesController[fn](req, res, next);
    } else if (['filesRestore', 'filesDelete'].includes(fn) && req.currentAccount.permissions.includes('attachmentFiles:delete')) {
      req.data = await filesController[fn](req, res, next);
    } else {
      return req.handleError(401001002, 'roles not permissions');
    }
  } else {
    return req.handleError(401001003, 'roles not permissions');
  }
  return next();
});

module.exports = router;