/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-08 09:46:33
 * @FilePath: /laboratory/application/drive/src/app/middleware/verify.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// require('dotenv').config();
// console.log(process.env.NODE_ENV, process.env);
// const path = require('path');

const sanitizeInput = (req, res, next) => {
	function replaceSensitiveInfo(data) {
		const sensitiveWords = ['password', 'credit card', 'social security number', '密码', '身份证', '信用卡'];
		for (let word of sensitiveWords) {
			const regex = new RegExp(word, 'gi');
			data = data.replace(regex, '******');
		}
		return data;
	}
	function sanitizeData(data) {
		if (typeof data === 'object') {
			// 如果数据是对象，则递归处理每个属性
			for (let key in data) {
				data[key] = sanitizeData(data[key]);
			}
		} else if (typeof data === 'string') {
			// 如果数据是字符串，则应用过滤器
			const xss = require('xss');
			data = xss(data); // XSS 过滤
			data = data.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, "''"); // SQL 转义单引号
			// data = path.normalize(data); // 路径规范化
			// data = replaceSensitiveInfo(data); // 敏感信息替换
		}
		return data;
	}
	if (req.body) {
		// 在这里对 req.body 进行过滤和验证
		// 例如，对每个属性应用适当的过滤器或验证器
		req.body = sanitizeData(req.body);
	}
	return next();
}

const token = async (req, res, next) => {
	const status = require('@utils/status');
	const secretsHelper = require('@helper/secrets');
	req.appSecret = req.headers['app-secret'] || false;
	req.appId = req.headers['app-id'] || false;
	req.siteId = req.headers['site-id'] || false;

	const timeStamp = (req.appSecret || '').toString().substring(32) || 0;
	if (!req.appId || timeStamp < Math.floor(Date.now() / 1000) - (process.env.TOKEN_TIME || 1800)) {
		return status.set(res).dictionary(401000001).response();
	}
	const secretRow = await secretsHelper.getAppId(req.appId);
	if (!secretRow?.app_id || !secretRow?.app_secret) {
		return status.set(res).dictionary(401000002).response();
	}
	if (!secretRow?.status) {
		return status.set(res).dictionary(401000003).response();
	}
	const cryptTool = require('@utils/cryptTool');
	const newSecret = cryptTool.md5(cryptTool.md5(secretRow.app_id.toString() + timeStamp.toString()) + secretRow.app_secret.toString()) + timeStamp.toString();
	if (req.appSecret !== newSecret) {
		return status.set(res).dictionary(401000004).response();
	}
	if (!req.siteId) {
		const sitesHelper = require('@helper/sites');
		const sitesRow = await sitesHelper.getHostname(req.headers['host'] || '');
		if (sitesRow.id) {
			req.siteId = sitesRow.site_id || sitesRow.id;
		} else {
			req.siteId = secretRow.extension?.siteId;
		}
	}
	if (req.siteId != secretRow.extension?.siteId && !secretRow.permissions?.includes('admin')) {
		return status.set(res).dictionary(401000005).response();
	}
	req.secretRow = secretRow;
	return next();
};

const sign = async (req, res, next) => {
	if (process.env.REQUEST_ENCRYPT === 'true') {
		// req.appSign = req.headers['app-sign'] || false;
		const { iv, encryptedData } = req.body;
		const cryptTool = require('@utils/cryptTool');
		const decryptedData = cryptTool.decrypt(encryptedData, req.secretRow?.app_secret, iv || '');
		req.body = { ...decryptedData }; //Object.assign({}, decryptedData);
	}
	return next();
};

const manageAuth = async (req, res, next) => {
	const status = require('@utils/status');
	const accountsHelper = require('@helper/accounts');
	const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
	const cryptTool = require('@utils/cryptTool');
	const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
	if (!decryptedData || !decryptedData.token) {
		return status.set(res).dictionary(401000006).response();
	}
	if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
		return status.set(res).dictionary(401000007).response();
	}
	const accountRow = await accountsHelper.getToken(decryptedData.token);
	if (!accountRow?.id) {
		return status.set(res).dictionary(401000008).response();
	}
	if (!accountRow?.status) {
		return status.set(res).dictionary(401000009).response();
	}
	req.currentAccount = accountRow;
	return next();
};

const consoleAuth = async (req, res, next) => {
	const status = require('@utils/status');
	const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
	const cryptTool = require('@utils/cryptTool');
	const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
	if (!decryptedData || !decryptedData.token) {
		return status.set(res).dictionary(401000010).response(encryptedToken.replace('Bearer ', ''));
	}
	if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
		return status.set(res).dictionary(401000011).response();
	}
	const accountService = require('@service/account');
	const accountClient = await accountService.connectionService(req, next);
	if (!accountClient) {
		return status.set(res).dictionary(401000012).response();
	}
	let result = await accountClient.verifyToken(decryptedData.token);
	if (result && result.iv) {
		result = await accountService.decryptData(result);
	}
	if (!result || result.error) {
		return status.set(res).dictionary(401000013).response();
	}
	if (!result?.id) {
		return status.set(res).dictionary(401000014).response();
	}
	if (!result?.status) {
		return status.set(res).dictionary(401000015).response();
	}
	req.currentAccount = result;
	return next();
};

const frontAuth = async (req, res, next) => {
	const status = require('@utils/status');
	const encryptedToken = req.headers['authorization'] || (req.headers['auth-token'] || '');
	const cryptTool = require('@utils/cryptTool');
	const decryptedData = cryptTool.decrypt(encryptedToken.replace('Bearer ', ''), req.secretRow?.app_secret, process.env.APP_KEY);
	if (!decryptedData || !decryptedData.token) {
		return status.set(res).dictionary(401000016).response();
	}
	if (!decryptedData.timeStamp || decryptedData.timeStamp < Math.floor(Date.now() / 1000) - Number(process.env.TOKEN_TIME)) {
		return status.set(res).dictionary(401000017).response();
	}
	const accountService = require('@service/account');
	const accountClient = await accountService.connectionService(req, next);
	if (!accountClient) {
		return status.set(res).dictionary(401000018).response();
	}
	let result = await accountClient.verifyToken(decryptedData.token);
	if (result && result.iv) {
		result = await accountService.decryptData(result);
	}
	if (!result || result.error) {
		return status.set(res).dictionary(401000019).response(result.error);
	}
	if (!result?.id) {
		return status.set(res).dictionary(401000020).response();
	}
	if (!result?.status) {
		return status.set(res).dictionary(401000021).response();
	}
	req.currentAccount = result;
	return next();
};

module.exports = {
	sanitizeInput,
	token,
	sign,
	manageAuth,
	consoleAuth,
	frontAuth
}