/*** 
 * @Author: trexwb
 * @Date: 2024-01-17 18:47:19
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:12:05
 * @FilePath: /laboratory/application/drive/src/app/route/console/authorize.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
// require('dotenv').config();
// console.log(process.env.NODE_ENV, process.env);

const express = require('express');
const router = express.Router();

const verifyMiddleware = require('@middleware/verify');

// 账号登录
router.post('/signIn', async (req, res, next) => {
  const signController = require('@controller/account/sign');
  req.data = await signController.signIn(req, res, next);
  return next();
});

// 密钥登录
router.post('/signSecret', async (req, res, next) => {
  const signController = require('@controller/account/sign');
  req.data = await signController.signSecret(req, res, next);
  return next();
});

// 个人信息
router.post('/signInfo', verifyMiddleware.consoleAuth, async (req, res, next) => {
  const signController = require('@controller/account/sign');
  req.data = await signController.signInfo(req, res, next);
  return next();
});

// 退出
router.post('/signOut', verifyMiddleware.consoleAuth, async (req, res, next) => {
  const signController = require('@controller/account/sign');
  req.data = await signController.signOut(req, res, next);
  return next();
});

module.exports = router;