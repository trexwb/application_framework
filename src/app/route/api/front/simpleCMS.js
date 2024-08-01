/*** 
 * @Author: trexwb
 * @Date: 2024-01-22 08:49:06
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:06:47
 * @FilePath: /drive/src/app/route/front/simpleCMS.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

// 非授权登录
// router.post(`/:fn(signIn|signSecret)`, async (req, res, next) => {
//   const { fn } = req.params;
//   const signController = require('@controller/caajwcPrint/sign');
//   req.data = await signController[fn](req, res, next);
//   return next();
// });

const languagesArray = ['languagesAll', 'languagesDetail'];
const customsArray = ['customsList', 'customsDetail'];
const columnsArray = ['columnsAll', 'columnsDetail'];
const categoriesArray = ['categoriesAll', 'categoriesDetail'];
const articlesArray = ['articlesList', 'articlesDetail', 'articlesHot'];
const optionCArray = ['optionHits', 'optionLikes', 'optionUnLikes', 'optionShares', 'optionUnShares', 'optionCollections', 'optionUnCollections'];
const userCArray = ['userLikes', 'userShares', 'userCollections'];

// 自定义相关
router.post(`/:fn(${[...languagesArray, ...customsArray, ...columnsArray, ...categoriesArray, ...articlesArray, ...optionCArray, ...userCArray].join('|')})`, async (req, res, next) => {
  const cacheCast = require('@cast/cache');
  const cacheTime = req.headers['cache-time'] || false;
  const { fn } = req.params;
  if (userCArray.includes(fn)) {
    const userController = require('@controller/simpleCMS/user');
    req.data = await userController[fn](req, res, next);
  } else if (optionCArray.includes(fn)) {
    const optionController = require('@controller/simpleCMS/option');
    req.data = await optionController[fn](req, res, next);
  } else { // 排除用户操作类均可使用缓存
    const cacheKey = `simpleCMS[${fn}:${req.siteId || ''},${JSON.stringify(req.body)}`;
    if (cacheTime) {
      req.data = await cacheCast.get(cacheKey);
    }
    if (!req.data) {
      if (languagesArray.includes(fn)) {
        const languagesController = require('@controller/simpleCMS/languages');
        req.data = await languagesController[fn](req, res, next);
      } else if (customsArray.includes(fn)) {
        const customsController = require('@controller/simpleCMS/customs');
        req.data = await customsController[fn](req, res, next);
      } else if (columnsArray.includes(fn)) {
        const columnsController = require('@controller/simpleCMS/columns');
        req.data = await columnsController[fn](req, res, next);
      } else if (categoriesArray.includes(fn)) {
        const categoriesController = require('@controller/simpleCMS/categories');
        req.data = await categoriesController[fn](req, res, next);
      } else if (articlesArray.includes(fn)) {
        const articlesController = require('@controller/simpleCMS/articles');
        req.data = await articlesController[fn](req, res, next);
      }
      if (cacheTime && req.data) {
        await cacheCast.set(cacheKey, req.data, cacheTime > 1800 ? 1800 : cacheTime);
      }
    }
  }
  // 文章列表及文章详情赋值
  if (["articlesList", "articlesDetail"].includes(fn)) {
    const behaviorController = require('@controller/simpleCMS/behavior');
    req.data = await behaviorController.articlesBehavior(req, res, next);
  }
  return next();
});

module.exports = router;