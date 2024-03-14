/*** 
 * @Author: trexwb
 * @Date: 2024-01-17 13:50:21
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-11 11:06:46
 * @FilePath: /laboratory/application/drive/src/app/service/account.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
const hprose = require("hprose");
const serversHelper = require('@helper/servers');

const cryptTool = require('@utils/cryptTool');

module.exports = {
	siteId: false, // 当前项目的站点编号
	proxy: null,
	serverRow: null,
	getClient: null,
	setSiteId: function (siteId) {
		this.siteId = siteId || false;
	},
	setClient: async function () {
		if (!this.getClient) {
			this.getClient = hprose.Client.create(this.serverRow?.url || '');
		}
		const timeStamp = Math.floor(Date.now() / 1000).toString();
		const newSecret = cryptTool.md5(cryptTool.md5(this.serverRow?.app_id.toString() + timeStamp) + this.serverRow?.app_secret.toString()) + timeStamp

		await this.getClient.setHeader("App-Id", this.serverRow?.app_id || '');
		await this.getClient.setHeader("App-Secret", newSecret);
		await this.getClient.setHeader("Site-Id", this.siteId);

		if (this.proxy) {
			return this.proxy;
		}
		if (this.serverRow?.extension?.mode === 'strict') { // 严格模式
			this.proxy = await this.getClient.useService(['rpc_getFunctions']);
			const result = await this.proxy.rpc_getFunctions();
			const funs = await this.decryptData(result);
			if (funs.error) {
				return funs.error;
			}
			this.proxy = await this.getClient.useService([...new Set([...this.serverRow.extension?.fn, ...funs])]);
		} else {
			this.proxy = await this.getClient.useService();
		}
		// return await proxy.login("access", "password").then(function (result) {
		// 	return result;
		// }).catchError(function (err) {
		// 	return err;
		// });
		return this.proxy;
	},
	connectionService: async function (req, next) {
		if (req.siteId) {
			this.setSiteId(req.siteId)
		}
		this.serverRow = await serversHelper.getKey('account');
		if (!this.serverRow?.id) {
			return req.handleError(500020001);
		}
		await this.setClient();
		if (!this.proxy) {
			return req.handleError(500020002);
		}
		return this.proxy;
	},
	decryptData: async function (result, req, next) {
		if (result && result.encryptedData && result.iv) {
			result = cryptTool.decrypt(result.encryptedData, this.serverRow?.app_secret, _data.iv);
		}
		if (result && result.error) {
			if (req, next) {
				return req.handleError(500020003);
			}
		}
		return result;
	}
}