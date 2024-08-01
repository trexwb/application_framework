/*** 
 * @Author: trexwb
 * @Date: 2024-01-08 11:57:36
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-11 21:14:02
 * @FilePath: /laboratory/application/drive/src/utils/multer.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const alias = require('@utils/alias');
const multer = require('multer');

module.exports = {
  array: () => {
    const upload = multer({ dest: alias.resolve(`@root/tmp`), limits: { fileSize: 10 * 1024 * 1024 } });
    return upload.array();
  }
};
