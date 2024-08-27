/*** 
 * @Author: trexwb
 * @Date: 2024-02-27 09:40:48
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:12:23
 * @FilePath: /laboratory/application/drive/src/app/route/front/attachment.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

// 自定义相关
router.post('/:fn', async (req, res, next) => {
  // 利用缓存将签名缓存起来
  const cacheCast = require('@cast/cache');
  const cacheTime = req.headers['cache-time'] || false;
  const { fn } = req.params;
  const cacheKey = `attachment[${fn}:${req.siteId || ''},${JSON.stringify(req.body)}`;
  if (cacheTime) {
    req.data = await cacheCast.get(cacheKey);
  }
  if (!req.data) {
    const signArray = ['getSign'];
    if (signArray.includes(fn)) {
      const signController = require('@controller/attachment/sign');
      req.data = await signController[fn](req, res, next);
    }
    if (cacheTime && req.data) {
      await cacheCast.set(cacheKey, req.data, cacheTime > 1800 ? 1800 : cacheTime);
    }
  }
  return next();
});

module.exports = router;