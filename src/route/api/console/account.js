/*** 
 * @Author: trexwb
 * @Date: 2024-06-18 09:13:25
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-18 09:20:05
 * @FilePath: /drive/src/app/route/console/account.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
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

const usersArray = ['usersList', 'usersDetail', 'usersSave', 'usersSort', 'usersEnable', 'usersDisable', 'usersRestore', 'usersDelete'];
const rolesArray = ['rolesList', 'rolesGet', 'rolesSave', 'rolesSort', 'rolesEnable', 'rolesDisable', 'rolesRestore', 'rolesDelete'];
const permissionsArray = ['permissionsList', 'permissionsGet', 'permissionsSave', 'permissionsSort', 'permissionsEnable', 'permissionsDisable', 'permissionsRestore', 'permissionsDelete'];

// 自定义相关
router.post(`/:fn(${[...usersArray, ...rolesArray, ...permissionsArray].join('|')})`, verifyMiddleware.manageAuth, async (req, res, next) => {
  const { fn } = req.params;
  if (usersArray.includes(fn)) {
    if (!req.body?.filter) {
      req.body.filter = {
        site_id: req.siteId
      }
    }
    const usersController = require('@controller/account/users');
    req.data = await usersController[fn](req, res, next);
  } else if (rolesArray.includes(fn)) {
    const rolesController = require('@controller/account/roles');
    req.data = await rolesController[fn](req, res, next);
  } else if (permissionsArray.includes(fn)) {
    const permissionsController = require('@controller/account/permissions');
    req.data = await permissionsController[fn](req, res, next);
  }
  return next();
});

module.exports = router;