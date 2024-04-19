/*** 
 * @Author: trexwb
 * @Date: 2024-01-17 13:50:21
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-14 15:34:38
 * @FilePath: /print/Users/wbtrex/website/localServer/node/damei/package/node/application_framework/src/app/service/test.js
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
		return this.proxy;
	},
	connectionService: async function (req) {
		if (req.siteId) {
			this.setSiteId(req.siteId)
		}
		this.serverRow = await serversHelper.getKey('服务名称');
		if (!this.serverRow?.id) {
			return req.handleError(500019001);
		}
		await this.setClient();
		if (!this.proxy) {
			return req.handleError(500019002);
		}
		return this.proxy;
	},
	decryptData: async function (result) {
		if (result && result.encryptedData && result.iv) {
			result = cryptTool.decrypt(result.encryptedData, this.serverRow?.app_secret, data.iv);
		}
		if (result?.error) {
			throw result?.error;
		}
		return result;
	}
}