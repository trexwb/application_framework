/*** 
 * @Author: trexwb
 * @Date: 2024-03-04 10:22:27
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:13:06
 * @FilePath: /laboratory/application/drive/src/app/route/manage/site.js
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
  const sitesController = require('@controller/drive/sites');
  req.data = await sitesController.getList(req, res, next);
  return next();
});

// 站点详情
router.post('/detail', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const sitesController = require('@controller/drive/sites');
  req.data = await sitesController.getRow(req, res, next);
  return next();
});

// 站点保存
router.post('/save', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const sitesController = require('@controller/drive/sites');
  req.data = await sitesController.save(req, res, next);
  return next();
});

// 处理 DELETE 请求
router.post('/delete', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const sitesController = require('@controller/drive/sites');
  req.data = await sitesController.softDelete(req, res, next);
  return next();
});
router.delete('/delete', verifyMiddleware.manageAuth, async (req, res, next) => {
  // req.currentAccount 当登录的账号
  const sitesController = require('@controller/drive/sites');
  req.data = await sitesController.softDelete(req, res, next);
  return next();
});

module.exports = router;