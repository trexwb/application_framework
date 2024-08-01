/*** 
 * @Author: trexwb
 * @Date: 2024-02-01 11:31:39
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:16:58
 * @FilePath: /drive/src/app/route/manage/authorize.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

const verifyMiddleware = require('@middleware/verify');

// 获取登录码
router.post('/getCode', async (req, res, next) => {
  const authorizeController = require('@controller/drive/authorize');
  req.data = await authorizeController.getCode(req, res, next);
  return next();
});

// code登录
router.post('/signIn', async (req, res, next) => {
  const authorizeController = require('@controller/drive/authorize');
  req.data = await authorizeController.signIn(req, res, next);
  return next();
});

// 密钥登录
router.post('/signSecret', async (req, res, next) => {
  const authorizeController = require('@controller/drive/authorize');
  req.data = await authorizeController.signSecret(req, res, next);
  return next();
});

// 获取绑定二维码
router.post('/bindCode', verifyMiddleware.manageAuth, async (req, res, next) => {
  const authorizeController = require('@controller/drive/authorize');
  req.data = await authorizeController.bindCode(req, res, next);
  return next();
});

// 退出
router.post('/signOut', verifyMiddleware.manageAuth, async (req, res, next) => {
  const authorizeController = require('@controller/drive/authorize');
  req.data = await authorizeController.signOut(req, res, next);
  return next();
});

module.exports = router;