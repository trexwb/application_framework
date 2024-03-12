/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-06 16:47:15
 * @FilePath: /laboratory/application/drive/src/app/middleware/response.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// require('dotenv').config();
// console.log(process.env.NODE_ENV, process.env);
// const cacheCast = require('@cast/cache');
// const databaseCast = require('@cast/database');

module.exports = {
	factory: async (req, res, next) => {
		const utils = require('@utils/index');
		const cryptTool = require('@utils/cryptTool');
		const status = require('@utils/status');
		let stream = {};
		const msgMap = status.msgMap;
		const dictionary = (code) => {
			stream = {
				msg: req.msg || (msgMap[code] || 'unknown error'),
				code: code
			}
			return Number((code || 0).toString().substring(0, 3) || 200);
		};
		const response = (data) => {
			if (data) {
				stream.data = JSON.parse(JSON.stringify(data));
				if (stream.data.length <= 0) {
					delete stream.data;
				}
			}
			return stream || false;
		}
		try {
			// 输出前关闭数据库
			const cacheCast = require('@cast/cache');
			await cacheCast.destroy();
		} catch (e) { }
		try {
			// 输出前关闭数据库
			const databaseCast = require('@cast/database');
			await databaseCast.destroy();
		} catch (e) { }
		try {
			if (req.currentAccount) { // 当前用户如果存在就返回新的token
				let token = {
					token: req.currentAccount?.remember_token || '',
					timeStamp: Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_TIME)
				};
				res.header('Auth-Token', cryptTool.encrypt(token, req.secretRow?.app_secret, process.env.APP_KEY));
			}
			if (req.data && process.env.RETURN_ENCRYPT === 'true') {
				// 加密后响应
				const key = req.secretRow?.app_secret || '';
				const iv = utils.generateRandomString(16);
				const encryptedText = cryptTool.encrypt(req.data, key, iv);
				return res.status(dictionary(req.code || 200)).send(response({
					iv: iv,
					encryptedData: encryptedText
				}));
				// 解密数据
				// const decryptedData = cryptTool.decrypt(encryptedText, key, iv) // cryptTool.decrypt(encryptedText, key, Buffer.from(iv.toString('hex'), 'hex'));
				// console.log(encryptedText, ':解密后的数据:', decryptedData);
			} else {
				// 常规返回
				return res.status(dictionary(req.code || 200)).send(response(req.data || null));
			}
		} catch (e) {
			return res.status(400).send(msgMap[400] || 'unknown error');
		}
	}
}