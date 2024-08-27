/*** 
 * @Author: trexwb
 * @Date: 2024-04-09 16:39:25
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-17 12:04:09
 * @FilePath: /drive/src/app/route/console/simpleCMS.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

const verifyMiddleware = require('@middleware/verify');

// 不需要验证权限的部分
const languagesNotRole = ['languagesAll'];
const customsNotRole = ['customsList'];
const columnsNotRole = ['columnsAll'];
const categoriesNotRole = ['categoriesAll'];
router.post(`/:fn(${[...languagesNotRole, ...customsNotRole, ...columnsNotRole, ...categoriesNotRole]})`, verifyMiddleware.consoleAuth, async (req, res, next) => {
  const { fn } = req.params;
  if (languagesNotRole.includes(fn)) {
    const languagesController = require('@controller/simpleCMS/languages');
    req.data = await languagesController[fn](req, res, next);
  } else if (customsNotRole.includes(fn)) {
    const customsController = require('@controller/simpleCMS/customs');
    req.data = await customsController[fn](req, res, next);
  } else if (columnsNotRole.includes(fn)) {
    const columnsController = require('@controller/simpleCMS/columns');
    req.data = await columnsController[fn](req, res, next);
  } else if (categoriesNotRole.includes(fn)) {
    const categoriesController = require('@controller/simpleCMS/categories');
    req.data = await categoriesController[fn](req, res, next);
  }
  return next();
});

// 需要验证权限的部分
const languagesArray = ['languagesAll', 'languagesDetail', 'languagesSave', 'languagesSort', 'languagesEnable', 'languagesDisable', 'languagesRestore', 'languagesDelete'];
const customsArray = ['customsList', 'customsDetail', 'customsSave', 'customsSort', 'customsEnable', 'customsDisable', 'customsRestore', 'customsDelete'];
const columnsArray = ['columnsAll', 'columnsDetail', 'columnsSave', 'columnsSort', 'columnsEnable', 'columnsDisable', 'columnsRestore', 'columnsDelete'];
const categoriesArray = ['categoriesAll', 'categoriesDetail', 'categoriesSave', 'categoriesSort', 'categoriesEnable', 'categoriesDisable', 'categoriesRestore', 'categoriesDelete'];
const articlesArray = ['articlesList', 'articlesDetail', 'articlesHot', 'articlesSave', 'articlesSort', 'articlesEnable', 'articlesDisable', 'articlesRestore', 'articlesDelete'];
// 自定义相关
router.post(`/:fn(${[...languagesArray, ...customsArray, ...columnsArray, ...categoriesArray, ...articlesArray].join('|')})`, verifyMiddleware.consoleAuth, async (req, res, next) => {
  const { fn } = req.params;
  // 需要验证权限的部分
  if (languagesArray.includes(fn) && req.currentAccount.roles.includes('simpleCMSLanguages')) {
    const languagesController = require('@controller/simpleCMS/languages');
    if (['languagesAll', 'languagesDetail'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSLanguages:read')) {
      req.data = await languagesController[fn](req, res, next);
    } else if (['languagesSave', 'languagesSort', 'languagesEnable', 'languagesDisable'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSLanguages:write')) {
      req.data = await languagesController[fn](req, res, next);
    } else if (['languagesRestore', 'languagesDelete'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSLanguages:delete')) {
      req.data = await languagesController[fn](req, res, next);
    } else {
      return req.handleError(401003001, 'roles not permissions');
    }
  } else if (customsArray.includes(fn) && req.currentAccount.roles.includes('simpleCMSCustoms')) {
    const customsController = require('@controller/simpleCMS/customs');
    if (['customsList', 'customsDetail'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSCustoms:read')) {
      req.data = await customsController[fn](req, res, next);
    } else if (['customsSave', 'customsSort', 'customsEnable', 'customsDisable'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSCustoms:write')) {
      req.data = await customsController[fn](req, res, next);
    } else if (['customsRestore', 'customsDelete'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSCustoms:delete')) {
      req.data = await customsController[fn](req, res, next);
    } else {
      return req.handleError(401003002, 'roles not permissions');
    }
  } else if (columnsArray.includes(fn) && req.currentAccount.roles.includes('simpleCMSColumns')) {
    const columnsController = require('@controller/simpleCMS/columns');
    if (['columnsList', 'columnsDetail'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSColumns:read')) {
      req.data = await columnsController[fn](req, res, next);
    } else if (['columnsSave', 'columnsSort', 'columnsEnable', 'columnsDisable'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSColumns:write')) {
      req.data = await columnsController[fn](req, res, next);
    } else if (['columnsRestore', 'columnsDelete'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSColumns:delete')) {
      req.data = await columnsController[fn](req, res, next);
    } else {
      return req.handleError(401003003, 'roles not permissions');
    }
  } else if (categoriesArray.includes(fn) && req.currentAccount.roles.includes('simpleCMSCategories')) {
    const categoriesController = require('@controller/simpleCMS/categories');
    if (['categoriesAll', 'categoriesDetail'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSCategories:read')) {
      req.data = await categoriesController[fn](req, res, next);
    } else if (['categoriesSave', 'categoriesSort', 'categoriesEnable', 'categoriesDisable'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSCategories:write')) {
      req.data = await categoriesController[fn](req, res, next);
    } else if (['categoriesRestore', 'categoriesDelete'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSCategories:delete')) {
      req.data = await categoriesController[fn](req, res, next);
    } else {
      return req.handleError(401003004, 'roles not permissions');
    }
  } else if (articlesArray.includes(fn) && req.currentAccount.roles.includes('simpleCMSArticles')) {
    const articlesController = require('@controller/simpleCMS/articles');
    if (['articlesList', 'articlesDetail', 'articlesHot'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSArticles:read')) {
      req.data = await articlesController[fn](req, res, next);
    } else if (['articlesSave', 'articlesSort', 'articlesEnable', 'articlesDisable'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSArticles:write')) {
      req.data = await articlesController[fn](req, res, next);
    } else if (['articlesRestore', 'articlesDelete'].includes(fn) && req.currentAccount.permissions.includes('simpleCMSArticles:delete')) {
      req.data = await articlesController[fn](req, res, next);
    } else {
      return req.handleError(401003005, 'roles not permissions');
    }
  } else {
    return req.handleError(401003006, 'roles not permissions');
  }
  return next();
});

module.exports = router;