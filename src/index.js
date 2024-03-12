/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-12 11:30:12
 * @FilePath: /print/Users/wbtrex/website/localServer/node/damei/package/node/application_framework/src/index.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */

// const timeConsole = {
//     start: Date.now(),
//     end: 0,
//     tempStart: 0,
//     tempEnd: 0
// };

require('dotenv').config();
require('module-alias/register');

const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    // 主进程
    const cpuCount = os.cpus().length;  // 获取 CPU 核心数

    // 为每个 CPU 核心创建一个工作进程
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    // 当工作进程退出时，重新启动一个新的工作进程
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        cluster.fork();
    });
} else {
    const alias = require('@utils/alias');
    // timeConsole.tempStart = Date.now();
    const express = require('express');
    require.cache['express'] = express;
    // timeConsole.tempEnd = Date.now();

    const app = express();
    // app.timeout = process.env.TIMEOUT || 30000;
    app.set('timeout', process.env.TIMEOUT || 30000);
    // static
    app.use(express.static(alias.resolve('@static')));
    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));
    // for parsing application/json
    app.use(express.json());
    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Origin', '*'); // 允许所有源访问，可以根据需求设置具体的源
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); // 允许的HTTP请求方法
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, App-Id, App-Secret, Site-Id, Auth-Token, Cache-Time'); // 允许的头部字段
        res.sendStatus(200);
    });
    app.use((req, res, next) => {
        req.msg = null;
        req.app = app;
        next();
        // res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有源访问，可以根据需求设置具体的源
        // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); // 允许的HTTP请求方法
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, App-Id, App-Secret, Site-Id, Auth-Token, Cache-Time'); // 允许的头部字段
        // req.method === 'OPTIONS' ? res.sendStatus(200) : next();
    });

    app.get('/', function (req, res) {
        res.status(200).sendFile(alias.resolve('@resources/view/index.html'));
    });

    const routeMiddleware = require('@middleware/route');
    routeMiddleware.notify(app); // 通知

    const verifyMiddleware = require('@middleware/verify');
    // app.use(verifyMiddleware.sanitizeInput); // 安全过滤
    app.use(verifyMiddleware.token); // appid校验
    app.use(verifyMiddleware.sign); // 安全传输加密

    routeMiddleware.controller(app);
    // app.use(routeMiddleware.controller);

    const responseMiddleware = require('@middleware/response');
    app.use(responseMiddleware.factory);

    app.listen(process.env.PORT || 8000, function () {
        console.log(`Server running at ${process.env.APP_URL || 'http://0.0.0.0'}:${process.env.PORT || 8000}/`);
    });
    // timeConsole.end = Date.now();
    // console.log(`run:${timeConsole.end - timeConsole.start}毫秒`, `tmp:${timeConsole.tempEnd - timeConsole.tempStart}毫秒`)
}