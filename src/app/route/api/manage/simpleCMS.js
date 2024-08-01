/*** 
 * @Author: trexwb
 * @Date: 2024-01-12 14:00:26
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:09:31
 * @FilePath: /drive/src/app/route/manage/simpleCMS.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
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

const languagesArray = ['languagesAll', 'languagesDetail', 'languagesSave', 'languagesSort', 'languagesEnable', 'languagesDisable', 'languagesRestore', 'languagesDelete'];
const customsArray = ['customsList', 'customsDetail', 'customsSave', 'customsSort', 'customsEnable', 'customsDisable', 'customsRestore', 'customsDelete'];
const columnsArray = ['columnsAll', 'columnsDetail', 'columnsSave', 'columnsSort', 'columnsEnable', 'columnsDisable', 'columnsRestore', 'columnsDelete'];
const categoriesArray = ['categoriesAll', 'categoriesDetail', 'categoriesSave', 'categoriesSort', 'categoriesEnable', 'categoriesDisable', 'categoriesRestore', 'categoriesDelete'];
const articlesArray = ['articlesList', 'articlesDetail', 'articlesSave', 'articlesSort', 'articlesEnable', 'articlesDisable', 'articlesRestore', 'articlesDelete', 'articlesHot'];

// 自定义相关
router.post(`/:fn(${[...languagesArray, ...customsArray, ...columnsArray, ...categoriesArray, ...articlesArray].join('|')})`, verifyMiddleware.manageAuth, async (req, res, next) => {
  const { fn } = req.params;
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
  return next();
});

module.exports = router;