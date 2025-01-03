/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:01:55
 * @FilePath: /git/application_framework/src/app/middleware/route.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const path = require('path');
const alias = require('@utils/alias');

// 按需引入依赖
const glob = require('glob');
// const { globSync } = require('fs');

/**
 * 加载路由文件并注册到 app 中
 * @param {string} basePath - 路由文件的基础路径
 * @param {string} prefix - 路由前缀
 * @param {Express.Application} app - Express 应用实例
 */
async function loadRoutes(basePath, prefix, app) {
  try {
    const files = glob.sync(`${basePath}/**/*.js`);
    await Promise.all(files.map(async (file) => {
      // 获取文件名和目录名
      const lastDirectory = path.basename(path.dirname(file));
      const routeName = path.basename(file, '.js');
      // 动态加载文件
      const route = require(file);
      // 添加路由
      // console.log(path.join('/', prefix, lastDirectory, routeName));
      if (lastDirectory === 'web') {
        app.use(`/${routeName}`, route);
      } else {
        app.use(path.join('/', prefix, lastDirectory, routeName), route);
      }
    }));
  } catch (error) {
    console.error(`路由加载错误: ${error.stack}`);
  }
}

module.exports = {
  web: async (app) => {
    await loadRoutes(alias.resolve('@route/web'), '', app);
  },
  api: async (app) => {
    await loadRoutes(alias.resolve('@route/api'), 'api', app);
  }
}