/*** 
 * @Author: trexwb
 * @Date: 2024-01-17 13:42:20
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-04 10:34:17
 * @FilePath: /laboratory/application/drive/src/app/route/front/index.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// const alias = require('@utils/alias');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  req.data = null;
  return next();
});

// 处理 POST 请求
router.post('/', (req, res, next) => {
  req.data = null;
  return next();
});

// 处理 PUT 请求
router.put('/', (req, res, next) => {
  req.data = null;
  return next();
});

// 处理 DELETE 请求
router.delete('/', (req, res, next) => {
  req.data = null;
  return next();
});

module.exports = router;