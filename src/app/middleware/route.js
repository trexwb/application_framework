/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-02-27 17:08:46
 * @FilePath: /laboratory/application/drive/src/app/middleware/route.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */

const path = require('path');
const glob = require('glob');
// const fs = require('fs');
const alias = require('@utils/alias');
const defaultVersion = 'v1';

module.exports = {
	controller: (app) => {
		try {
			const files = glob.sync(`${alias.resolve(`@route`)}/**/*.js`);
			files.forEach(file => {
				// 获取文件名
				const lastDirectory = path.dirname(file).split('/').pop();
				const routeName = path.basename(file).split('.')[0];
				// 动态加载文件
				const route = require(file);
				// 添加路由
				app.use(`/api/${lastDirectory}/${routeName}`, route);
			});
			// fs.readdirSync(`${alias.resolve(`@route`)}/test`).forEach(file => {
			// 	// 获取文件名
			// 	const lastDirectory = path.dirname(`${alias.resolve(`@route`)}/test/${file}`).split('/').pop();
			// 	const routeName = path.basename(`${alias.resolve(`@route`)}/test/${file}`).split('.')[0];
			// 	// 动态加载文件
			// 	const route = require(`${alias.resolve(`@route`)}/test/${file}`);
			// 	// 添加路由
			// 	console.log(`/api/${lastDirectory}/${routeName}`)
			// 	app.use(`/api/${lastDirectory}/${routeName}`, route);
			// });
		} catch (e) {
			console.log(`route:路由错误`);
		}
	},
	version: (app) => {
		const versionHeader = req.headers['version'] || defaultVersion;
		let dirPath = alias.resolve(`@route/${versionHeader}`);
		try {
			const files = glob.sync(`${dirPath}/*.js`);
			files.forEach(file => {
				// 获取文件名
				const routeName = file.split('.')[0];
				// 动态加载文件
				const route = require(alias.resolve(`@route/${versionHeader}/${file}`));
				// 添加路由
				app.use(`/api/${routeName}`, route);
				app.use(`/api/${versionHeader}/${routeName}`, route);
			});
			// fs.readdirSync(dirPath).forEach(file => {
			// 	const routeName = file.split('.')[0];
			// 	const route = require(alias.resolve(`@route/${versionHeader}/${file}`));
			// 	app.use(`/${routeName}`, route);
			// 	app.use(`/${versionHeader}/${routeName}`, route);
			// });
		} catch (e) {
			console.log(`header:版本号[${versionHeader}]错误`);
		}

		const versionPath = (path.parse(req.originalUrl)['dir'] || defaultVersion).replace('\/', '');
		if (versionPath && /^v\d$/.test(versionPath) && versionHeader !== versionPath) {
			dirPath = alias.resolve(`@route/${versionPath}`);
			try {
				const files = glob.sync(`${dirPath}/*.js`);
				files.forEach(file => {
					// 获取文件名
					const routeName = file.split('.')[0];
					// 动态加载文件
					const route = require(alias.resolve(`@route/${versionHeader}/${file}`));
					// 添加路由
					app.use(`/api/${versionHeader}/${routeName}`, route);
				});
				// fs.readdirSync(dirPath).forEach(file => {
				// 	const routeName = file.split('.')[0];
				// 	const route = require(alias.resolve(`@route/${versionPath}/${file}`));
				// 	app.use(`/${versionPath}/${routeName}`, route);
				// });
			} catch (e) {
				console.log(`path:版本号[${versionPath}]错误`);
			}
		}
	},
	notify: (app) => {
		const express = require('express');
		const router = express.Router();
		router.post('/:fn', async function (req, res, next) {
			const { fn } = req.params;
			if (fn === 'attachment') {
				const signController = require('@controller/attachment/sign');
				await signController.notify(req, res, next)
			}
			res.status(200).send('Success');
		});
		app.use(`/notify`,router)
	}
}