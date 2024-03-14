/*** 
 * @Author: trexwb
 * @Date: 2024-01-09 08:52:32
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-14 10:17:50
 * @FilePath: /laboratory/application/drive/src/index.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// 引入环境变量配置
require('dotenv').config();
require('module-alias/register');

function initApp() {
    const alias = require('@utils/alias');
    const express = require('express');
    // 缓存express以避免重复加载
    require.cache['express'] = express;

    const app = express();
    app.set('timeout', process.env.TIMEOUT || 30000);
    app.use(express.static(alias.resolve('@static')));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, App-Id, App-Secret, Site-Id, Auth-Token, Cache-Time');
        res.sendStatus(200);
    });

    app.use((req, res, next) => {
        req.msg = null;
        req.app = app;
        req.handleError = function (code, error) {
            req.code = code;
            if (error) {
                const errorStr = error.toString();
                // 日志使用
                const logCast = require('@cast/log');
                const forwardedFor = req.headers['x-forwarded-for'] || '';
                const ip = forwardedFor.split(',')[0] || req.ip;
                req.realIP = ip;
                logCast.writeError(errorStr, { ...req.headers, ...req.body }, req.realIP);
                req.msg = errorStr;
            }
            // console.error('发生错误:', errorStr);
        }
        next();
    });

    app.get('/', function (req, res) {
        res.status(200).sendFile(alias.resolve('@resources/view/index.html'));
    });

    // 通知类路由
    const notifyRouter = express.Router();
    notifyRouter.post('/:fn', async function (req, res, next) {
        const { fn } = req.params;
        if (fn === 'attachment') {
            const signController = require('@controller/attachment/notify');
            await signController.notify(req, res, next)
        }
        res.status(200).send('Success');
    });
	app.use(`/notify`,notifyRouter)

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
        // 工作进程
        const app = initApp();
    }
} else {
    // 单进程模式
    const app = initApp();
}