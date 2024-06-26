/*** 
 * @Author: trexwb
 * @Date: 2024-01-12 08:45:55
 * @LastEditors: trexwb
 * @LastEditTime: 2024-04-03 19:42:20
 * @FilePath: /laboratory/Users/wbtrex/website/localServer/node/damei/package/node/application_framework/src/app/helper/secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
const utils = require('@utils/index');
const cacheCast = require('@cast/cache');
const secretsModel = require('@model/secrets');

function buildWhere(that, where) {
	that.where('id', '>', 0);
	function applyWhereCondition(field, value) {
		if (Array.isArray(value)) {
			if (value.length > 0) that.whereIn(field, value);
		} else {
			that.where(field, value);
		}
	}
	if (where.id) {
		applyWhereCondition('id', where.id);
	}
	if (where.app_id) {
		applyWhereCondition('app_id', where.app_id);
	}
	if (where.status) {
		applyWhereCondition('status', where.status);
	}
	if (where.keywords) {
		that.where(function () {
			this.orWhere('title', 'like', `%${where.keywords}%`);
			this.orWhere('app_id', 'like', `%${where.keywords}%`);
			this.orWhere('extension', 'like', `%${where.keywords}%`);
		});
	}
}

const secretsHelper = {
	getAppId: async function (appId) {
		if (!appId) return;
		let row = {};
		try {
			const cacheKey = `secrets:[appid:${appId}]`;
			row = await cacheCast.get(cacheKey);
			if (!row?.id) {
				row = await secretsModel.getRow(function () {
					buildWhere(this, { "app_id": appId })
				});
				if (row?.id) {
					await cacheCast.setCacheWithTags('secrets', cacheKey, row)
				}
			}
		} catch (error) {
			throw error;
		}
		return row;
	},
	getList: async function (where, order, _page, _pageSize) { // await secretsHelper.getList({keywords: '1',status: '0'});
		let rows = {};
		try {
			const sortWhere = utils.sortMultiDimensionalObject(where);
      const sortOrder = utils.sortMultiDimensionalObject(order);
			const page = utils.safeCastToInteger(_page ?? 1);
			const pageSize = utils.safeCastToInteger(_pageSize ?? 10);
			const offset = utils.safeCastToInteger(!page ? 0 : pageSize * (page - 1));
			const cacheKey = `secrets:[list:${JSON.stringify([sortWhere, sortOrder, page, pageSize])}]`;
			rows = await cacheCast.get(cacheKey);
			if (!rows?.total) {
				rows = await secretsModel.getList(function () {
					buildWhere(this, where)
				}, order, pageSize, offset);
				if (rows?.total) {
					await cacheCast.setCacheWithTags('secrets', cacheKey, rows);
				}
			}
		} catch (error) {
			throw error;
		}
		return rows;
	},
	getId: async function (id) {
		if (!id) return {};
		let row = {};
		try {
			const cacheKey = `secrets:[id:${id}]`;
			row = await cacheCast.get(cacheKey);
			if (!row?.id) {
				row = await secretsModel.getRow(function () {
					buildWhere(this, { "id": id })
				});
				if (row?.id) {
					await cacheCast.setCacheWithTags('secrets', cacheKey, row);
				}
			}
		} catch (error) {
			throw error;
		}
		return row;
	},
	save: async function (data) {
		if (!data) return;
		let affects = {};
		try {
			affects = await secretsModel.save(data);
			await cacheCast.clearCacheByTag('secrets');
		} catch (error) {
			throw error;
		}
		return affects;
	},
	restore: async function (id) {
		if (!id) return;
		let affects = {};
		try {
			affects = await secretsModel.restore(function () {
				buildWhere(this, { "id": id })
			});
			await cacheCast.clearCacheByTag('secrets');
		} catch (error) {
			throw error;
		}
		return affects;
	},
	delete: async function (id) {
		if (!id) return;
		let affects = {};
		try {
			affects = await secretsModel.softDelete(function () {
				buildWhere(this, { "id": id })
			});
			await cacheCast.clearCacheByTag('secrets');
		} catch (error) {
			throw error;
		}
		return affects;
	},
}

module.exports = secretsHelper;