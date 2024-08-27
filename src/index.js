/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 11:56:52
 * @FilePath: //application_framework/src/index.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// 引入环境变量配置
'use strict';
require('dotenv').config();
require('module-alias/register');
/**
 * 初始化应用程序
 * 
 * 本函数负责配置和启动express应用它包括设置超时时间、处理静态文件、
 * 解析请求体、配置跨域访问、应用中间件和路由最后监听指定端口
 * 
 * @returns {Function} 返回express应用实例
 */
function initApp() {
  const alias = require('@utils/alias');
  const express = require('express');
  const multer = require('multer');

  // 缓存express以避免重复加载
  require.cache['express'] = express;

  const app = express();
  app.set('timeout', process.env.TIMEOUT || 30000);

  // 静态文件服务优化
  app.use('/static', express.static(alias.resolve('@static')));
  app.use('/download', express.static((process.env.NODE_ENV === 'development' ? '/app/data' : '/data') + '/download'));

  // 解析请求体的中间件应放在前面
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(multer().none());

  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, App-Id, App-Secret, Site-Id, Auth-Token, Cache-Time');
    res.sendStatus(200);
  });

  const middlewareRes = require('@middleware/response');
  app.use(middlewareRes.factory);

  app.get('/', function (req, res) {
    res.status(200).sendFile(alias.resolve('@resources/view/index.html'));
  });

  // 其他可访问路由
  const middlewareRoute = require('@middleware/route');
  middlewareRoute.web(app);
  middlewareRoute.api(app);

  // 输出
  app.use(middlewareRes.build);

  app.listen(process.env.PORT || 8000, function () {
    console.log(`Server running at ${process.env.APP_URL || 'http://0.0.0.0'}:${process.env.PORT || 8000}/`);
  });

  return app;
}

if (process.env.MULTIPLE_PROCESSES === "true") {
  const cluster = require('cluster');
  if (cluster.isMaster) {
    // 主进程
    const os = require('os');
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

// 计划任务
const schedule = require('@schedule/index');
schedule.handler();

// 消息消费
const job = require('@job/index');
job.queue.handler();

// FC/serverless 相关方法
exports.handler = async function (event, context) {
  // console.log("event: \n" + event);
  return "Success";
};
exports.initialize = function (context, callback) {
  // console.log('initializer');
  callback(null, "");
};
module.exports.preFreeze = function (context, callback) {
  try {
    // 销毁服务前关闭数据库
    const cacheInterface = require('@interface/cache');
    cacheInterface.destroy();
  } catch (e) { }
  try {
    // 销毁服务前关闭数据库
    const dbInterface = require('@interface/database');
    dbInterface.destroy();
  } catch (e) { }
  try {
    // 销毁服务前关闭数据库
    const job = require('@job/index');
    job.queue.destroy();
  } catch (e) { }
  callback(null, "");
};
module.exports.preStop = function (context, callback) {
  try {
    // 销毁服务前关闭数据库
    const cacheInterface = require('@interface/cache');
    cacheInterface.destroy();
  } catch (e) { }
  try {
    // 销毁服务前关闭数据库
    const dbInterface = require('@interface/database');
    dbInterface.destroy();
  } catch (e) { }
  try {
    // 销毁服务前关闭数据库
    const job = require('@job/index');
    job.queue.destroy();
  } catch (e) { }
  callback(null, '');
}