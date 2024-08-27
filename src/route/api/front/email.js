/*** 
 * @Author: trexwb
 * @Date: 2024-05-07 11:38:49
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:12:32
 * @FilePath: /laboratory/application/drive/src/app/route/front/email.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const express = require('express');
const router = express.Router();

// 自定义相关
router.post('/sendRequest', async (req, res, next) => {
  const sendController = require('@controller/email/send');
  req.data = await sendController.sendRequest(req, res, next);
  return next();
});

module.exports = router;