/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2024-05-29 14:00:49
 * @FilePath: /conf/Users/wbtrex/website/localServer/node/trexwb/git/application_framework/index.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// 引入环境变量配置
'use strict';
require('dotenv').config();
require('module-alias/register');

function initApp() {
  const alias = require('@utils/alias');
  const express = require('express');
  const multer = require('multer');
  // 缓存express以避免重复加载
  require.cache['express'] = express;

  const app = express();
  app.set('timeout', process.env.TIMEOUT || 30000);

  // 静态文件服务优化
  app.use(express.static(alias.resolve('@static')));

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

  app.use((req, res, next) => {
    req.body = Object.assign({}, req.body) // JSON.parse(JSON.stringify(req.body));
    req.msg = null;
    req.app = app;
    req.handleError = function (code, error, write = false) {
      req.code = code;
      req.msg = error ? error.toString() : null;
      if ((write || String(code).startsWith('500')) && req.msg) {
        // 日志使用
        const logCast = require('@cast/log');
        const forwardedFor = req.headers['x-forwarded-for'] || '';
        const ip = forwardedFor.split(',')[0] || req.ip;
        req.realIP = ip;
        logCast.writeError(req.msg, { ...req.headers, ...req.body }, req.realIP);
      }
    }
    next();
  });

  app.get('/', function (req, res) {
    res.status(200).sendFile(alias.resolve('@resources/view/index.html'));
  });

  // 通知类路由
  const notifyRouter = require('@middleware/notify');
  app.use(`/notify`, notifyRouter);

  const verifyMiddleware = require('@middleware/verify');
  // app.use(verifyMiddleware.sanitizeInput); // 安全过滤
  app.use(verifyMiddleware.token); // appid校验
  app.use(verifyMiddleware.sign); // 安全传输加密

  const routeMiddleware = require('@middleware/route');
  routeMiddleware.controller(app);
  // app.use(routeMiddleware.controller);

  const responseMiddleware = require('@middleware/response');
  app.use(responseMiddleware.factory);

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
const schedule = require('@root/src/schedule/task');
schedule.handler();

// 消息消费
const queue = require('@job/queue');
queue.handler();

exports.handler = async function(event, context) {
  // console.log("event: \n" + event);
  return "Success";
};

exports.pre_stop = (context, callback) => {
  try {
    // 销毁服务前关闭数据库
    const cacheCast = require('@cast/cache');
    cacheCast.destroy();
  } catch (e) { }
  try {
    // 销毁服务前关闭数据库
    const databaseCast = require('@cast/database');
    databaseCast.destroy();
  } catch (e) { }
  callback(null, '');
}