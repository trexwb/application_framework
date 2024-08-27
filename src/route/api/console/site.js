/*** 
 * @Author: trexwb
 * @Date: 2024-03-04 10:26:56
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 17:47:54
 * @FilePath: /drive/src/app/route/console/site.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

// 站点列表
router.post('/getHostname', async (req, res, next) => {
  const cacheCast = require('@cast/cache');
  const cacheTime = req.headers['cache-time'] || false;
  const cacheKey = `site[getHostname:${JSON.stringify(req.body)}`;
  if (cacheTime) {
    req.data = await cacheCast.get(cacheKey);
  }
  if (!req.data) {
    const sitesController = require('@controller/drive/sites');
    req.data = await sitesController.getHostname(req, res, next);
    if (cacheTime && req.data) {
      await cacheCast.set(cacheKey, req.data, cacheTime > 1800 ? 1800 : cacheTime);
    }
  }
  return next();
});

// 站点列表
router.post('/clearCache', async (req, res, next) => {
  const cacheCast = require('@cast/cache');
  const client = await cacheCast.connect();
  req.data = await client.flushAll();
  return next();
});

module.exports = router;