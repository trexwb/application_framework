/*
 * @Author: trexwb
 * @Date: 2023-12-16 09:52:40
 * @LastEditors: trexwb
 * @LastEditTime: 2023-12-29 16:27:21
 * @FilePath: \applications\drive\src\app\controller\v1\manages.js
 * @Description: In User Settings Edit
 * 一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
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
  req.data = {};
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