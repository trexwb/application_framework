/*** 
 * @Author: trexwb
 * @Date: 2024-02-27 19:20:50
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:08:18
 * @FilePath: /drive/src/app/route/manage/attachment.js
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
const platformsArray = ['platformsList', 'platformsDetail', 'platformsSave', 'platformsSort', 'platformsEnable', 'platformsDisable', 'platformsRestore', 'platformsDelete'];
const configsArray = ['configsList', 'configsDetail', 'configsSave', 'configsSort', 'configsEnable', 'configsDisable', 'configsRestore', 'configsDelete'];
const filesArray = ['filesList', 'filesDetail', 'filesSave', 'filesSort', 'filesEnable', 'filesDisable', 'filesRestore', 'filesDelete'];

// 自定义相关
router.post(`/:fn(${[...signArray, ...platformsArray, ...configsArray, ...filesArray].join('|')})`, verifyMiddleware.manageAuth, async (req, res, next) => {
  const { fn } = req.params;
  if (signArray.includes(fn)) {
    const signController = require('@controller/attachment/sign');
    req.data = await signController[fn](req, res, next);
  } else if (platformsArray.includes(fn)) {
    const platformsController = require('@controller/attachment/platforms');
    req.data = await platformsController[fn](req, res, next);
  } else if (configsArray.includes(fn)) {
    const configsController = require('@controller/attachment/configs');
    req.data = await configsController[fn](req, res, next);
  } else if (filesArray.includes(fn)) {
    const filesController = require('@controller/attachment/files');
    req.data = await filesController[fn](req, res, next);
  }
  return next();
});

module.exports = router;