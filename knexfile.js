/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-09 09:34:32
 * @FilePath: /laboratory/application/drive/knexfile.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
require('dotenv').config();
// Update with your config settings.
require('module-alias/register');
const knexConfig = require('@config/knex.js');
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: knexConfig.write,
  stage: knexConfig.write,
  production: knexConfig.write
}
