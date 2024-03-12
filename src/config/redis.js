/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-02-21 14:47:25
 * @FilePath: /laboratory/application/drive/src/config/redis.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// Update with your config settings.
// require('dotenv').config();
// console.log(process.env.NODE_ENV, process.env);

module.exports = {
    host: process.env.CACHE_HOST || '127.0.0.1',
    port: process.env.CACHE_PORT || 6379,
    password: process.env.CACHE_PASSWORD || '',
    db: Number(process.env.CACHE_DB || 0),
    prefix: process.env.CACHE_PREFIX || ''
};