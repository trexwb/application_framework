/*** 
 * @Author: trexwb
 * @Date: 2024-07-10 12:45:58
 * @LastEditors: trexwb
 * @LastEditTime: 2024-07-10 12:46:35
 * @FilePath: /drive/src/app/route/web/heartbeat.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  // console.log(rpcFuns, result);
  res.status(200).send('Success');
});

module.exports = router;