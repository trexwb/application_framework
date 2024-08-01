/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-07-04 11:11:38
 * @FilePath: /drive/src/app/middleware/route.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

const path = require('path');
const glob = require('glob');
const alias = require('@utils/alias');
module.exports = {
  web: (app) => {
    try {
      const files = glob.sync(`${alias.resolve(`@route`)}/web/**/*.js`);
      files.forEach(file => {
        // 获取文件名
        const lastDirectory = path.dirname(file).split('/').pop();
        const routeName = path.basename(file).split('.')[0];
        // 动态加载文件
        const route = require(file);
        // 添加路由
        if (lastDirectory === 'web') {
          app.use(`/${routeName}`, route);
        } else {
          app.use(`/${lastDirectory}/${routeName}`, route);
        }
      });
    } catch (e) {
      console.log(`route:web路由错误`);
    }
  },
  api: (app) => {
    try {
      const files = glob.sync(`${alias.resolve(`@route`)}/api/**/*.js`);
      files.forEach(file => {
        // 获取文件名
        const lastDirectory = path.dirname(file).split('/').pop();
        const routeName = path.basename(file).split('.')[0];
        // 动态加载文件
        const route = require(file);
        // 添加路由
        app.use(`/api/${lastDirectory}/${routeName}`, route);
      });
    } catch (e) {
      console.log(`route:api路由错误`);
    }
  },
  /**
   * 根据路由识别版本号
   * 已废弃
   */
  // version: (app) => {
  //   const defaultVersion = 'v1';
  //   const versionHeader = req.headers['version'] || defaultVersion;
  //   let dirPath = alias.resolve(`@route/${versionHeader}`);
  //   try {
  //     const files = glob.sync(`${dirPath}/*.js`);
  //     files.forEach(file => {
  //       // 获取文件名
  //       const routeName = file.split('.')[0];
  //       // 动态加载文件
  //       const route = require(alias.resolve(`@route/${versionHeader}/${file}`));
  //       // 添加路由
  //       app.use(`/api/${routeName}`, route);
  //       app.use(`/api/${versionHeader}/${routeName}`, route);
  //     });
  //     // fs.readdirSync(dirPath).forEach(file => {
  //     // 	const routeName = file.split('.')[0];
  //     // 	const route = require(alias.resolve(`@route/${versionHeader}/${file}`));
  //     // 	app.use(`/${routeName}`, route);
  //     // 	app.use(`/${versionHeader}/${routeName}`, route);
  //     // });
  //   } catch (e) {
  //     console.log(`header:版本号[${versionHeader}]错误`);
  //   }
  //   const versionPath = (path.parse(req.originalUrl)['dir'] || defaultVersion).replace('\/', '');
  //   if (versionPath && /^v\d$/.test(versionPath) && versionHeader !== versionPath) {
  //     dirPath = alias.resolve(`@route/${versionPath}`);
  //     try {
  //       const files = glob.sync(`${dirPath}/*.js`);
  //       files.forEach(file => {
  //         // 获取文件名
  //         const routeName = file.split('.')[0];
  //         // 动态加载文件
  //         const route = require(alias.resolve(`@route/${versionHeader}/${file}`));
  //         // 添加路由
  //         app.use(`/api/${versionHeader}/${routeName}`, route);
  //       });
  //       // fs.readdirSync(dirPath).forEach(file => {
  //       // 	const routeName = file.split('.')[0];
  //       // 	const route = require(alias.resolve(`@route/${versionPath}/${file}`));
  //       // 	app.use(`/${versionPath}/${routeName}`, route);
  //       // });
  //     } catch (e) {
  //       console.log(`path:版本号[${versionPath}]错误`);
  //     }
  //   }
  // }
}