/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 09:57:23
 * @FilePath: /git/application_framework/src/index.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// 引入环境变量配置
'use strict';
require('dotenv').config();
require('module-alias/register');

const alias = require('@utils/alias');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cluster = require('cluster');
const os = require('os');

const middlewareRes = require('@middleware/response');
const middlewareRoute = require('@middleware/route');
const schedule = require('@schedule/index');
const job = require('@job/index');
const cacheInterface = require('@interface/cache');
const dbInterface = require('@interface/database');
/**
 * 初始化应用程序
 * 
 * 本函数负责配置和启动express应用它包括设置超时时间、处理静态文件、
 * 解析请求体、配置跨域访问、应用中间件和路由最后监听指定端口
 * 
 * @returns {Function} 返回express应用实例
 */
async function initApp() {
  // 缓存express以避免重复加载
  // require.cache['express'] = express;
  const app = express();
  app.set('timeout', process.env.TIMEOUT || 30000);

  // 静态文件服务优化
  app.use('/static', express.static(alias.resolve('@static')));
  app.use('/download', express.static(path.join(process.env.NODE_ENV === 'development' ? '/app/data' : '/data', 'download')));

  // 解析请求体的中间件应放在前面
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(multer().none());
  
  app.use(middlewareRes.factory);

  app.get('/', function (req, res) {
    res.status(200).sendFile(alias.resolve('@resources/view/index.html'));
  });

  // 其他可访问路由
  await middlewareRoute.web(app);
  await middlewareRoute.api(app);

  // 输出
  app.use(middlewareRes.build);

  app.listen(process.env.PORT || 9000, function () {
    console.log(`Server running at ${process.env.APP_URL || 'http://0.0.0.0'}:${process.env.PORT || 9000}/`);
  });

  // 引入计划任务模块，用于处理计划任务
  try {
    schedule.handler();
  } catch (error) {
    console.error('Error in schedule handler:', error);
  }
  // 引入消息消费模块，用于处理消息消费
  try {
    job.queue.handler();
  } catch (error) {
    console.error('Error in job queue handler:', error);
  }

  return app;
}

if (process.env.MULTIPLE_PROCESSES === "true") {
  if (cluster.isMaster) {
    // 主进程
    const cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`工作进程 ${worker.process.pid} 已退出`);
      cluster.fork();
    });
  } else {
    initApp();
  }
} else {
  initApp();
}

function destroyResources(context, callback) {
  try {
    cacheInterface.destroy();
  } catch (e) {}
  try {
    dbInterface.destroy();
  } catch (e) {}
  try {
    job.queue.destroy();
  } catch (e) {}
  callback(null, "");
}

// FC/serverless 相关方法
module.exports.handler = async function (event, context, callback) {
  // console.log("event: \n" + event);
  return "Success";
};
module.exports.initialize = function (context, callback) {
  // console.log('initializer');
  callback(null, "");
};
module.exports.preFreeze = destroyResources;
module.exports.preStop = destroyResources;