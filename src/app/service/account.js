/*** 
 * @Author: trexwb
 * @Date: 2024-01-17 13:50:21
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:03:02
 * @FilePath: /git/application_framework/src/app/service/account.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const hprose = require("hprose");
const serversHelper = require('@helper/servers');

const cryptTool = require('@utils/cryptTool');

module.exports = {
	proxy: null,
	serverRow: null,
	getClient: null,
  setServer: async function () {
    this.serverRow = await serversHelper.getKey('accounts');
    if (!this.serverRow) {
			throw false;
		}
  },
	setClient: async function () {
		if (!this.getClient) {
			this.getClient = await hprose.Client.create(this.serverRow?.url);
		}
		const timeStamp = Math.floor(Date.now() / 1000).toString();
		const newSecret = cryptTool.md5(cryptTool.md5(this.serverRow?.app_id.toString() + timeStamp) + this.serverRow?.app_secret.toString()) + timeStamp

		this.getClient.setHeader("App-Id", this.serverRow?.app_id);
		this.getClient.setHeader("App-Secret", newSecret);

		if (this.serverRow?.extension?.mode === 'strict') { // 严格模式
			this.proxy = await this.getClient.useService(['rpc_getFunctions']);
			const result = await this.proxy.rpc_getFunctions();
			const funs = await this.decryptData(result);
			this.proxy = await this.getClient.useService([...new Set([...this.serverRow.extension?.fn, ...funs])]);
		} else {
			this.proxy = await this.getClient.useService();
		}
		return this.proxy;
	},
	connectionService: async function () {
    if (!this.serverRow) {
      await this.setServer();
    }
		return await this.setClient();
	},
	decryptData: async function (result) {
		if (result && result.encryptedData && result.iv) {
			result = cryptTool.decrypt(result.encryptedData, this.serverRow?.app_secret, result.iv);
		}
		// if (result?.error) {
		// 	throw result?.error;
		// }
		return result;
	}
}