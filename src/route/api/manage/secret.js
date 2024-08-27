/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:13:00
 * @FilePath: /laboratory/application/drive/src/app/route/manage/secret.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

const verifyMiddleware = require('@middleware/verify');

// 站点列表
router.post('/', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.getList(req, res, next);
  return next();
});

// 站点详情
router.post('/detail', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.getRow(req, res, next);
  return next();
});

// 站点保存
router.post('/save', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.save(req, res, next);
  return next();
});

// 站点更换
router.post('/updateSecret', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.update(req, res, next);
  return next();
});

// 启用
router.post('/enable', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.enable(req, res, next);
  return next();
});

// 禁用
router.post('/disable', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.disable(req, res, next);
  return next();
});

// 处理 DELETE 请求
router.post('/delete', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.softDelete(req, res, next);
  return next();
});
router.delete('/delete', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const secretController = require('@controller/drive/secret');
  req.data = await secretController.softDelete(req, res, next);
  return next();
});

module.exports = router;