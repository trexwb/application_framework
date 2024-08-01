/*** 
 * @Author: trexwb
 * @Date: 2024-04-08 11:45:24
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:11:05
 * @FilePath: /laboratory/application/drive/src/app/middleware/notify.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const express = require('express');
const router = express.Router();

router.post('/attachment', async function (req, res, next) {
  try {
    const notifyController = require('@controller/attachment/notify');
    await notifyController.notify(req, res, next);
    res.status(200).send('Success');
  } catch (error) {
    req.handleError(500, error);
  }
});

router.post('/payment', async function (req, res, next) {
  try {
    const notifyController = require('@controller/payment/notify');
    await notifyController.notify(req, res, next);
    res.status(200).send('Success');
  } catch (error) {
    req.handleError(500, error);
  }
});

module.exports = router;