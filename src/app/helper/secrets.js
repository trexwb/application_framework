/*** 
 * @Author: trexwb
 * @Date: 2024-01-12 08:45:55
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 12:00:14
 * @FilePath: /lication_framework/src/app/helper/secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const utils = require('@utils/index');
const cacheCast = require('@cast/cache');
const secretsModel = require('@model/secrets');
const baseHelper = require('@helper/base');

const secretsHelper = {
  $cacheKey: 'secrets',
  $model: secretsModel,
  ...baseHelper,
  buildWhere: function (that, where) {
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
    if (where.status || where.status === 0) {
      applyWhereCondition('status', where.status);
    }
    if (where.keywords) {
      that.where(function () {
        this.orWhere('title', 'like', `%${where.keywords}%`);
        this.orWhere('app_id', 'like', `%${where.keywords}%`);
        this.orWhere('extension', 'like', `%${where.keywords}%`);
      });
    }
  },
  getAppId: async function (appId) {
    if (!appId) return;
    let row = {};
    try {
      const that = this;
      const cacheKey = `${this.$cacheKey}[appid:${appId}]`;
      row = await cacheCast.get(cacheKey);
      if (!row?.id) {
        row = await secretsModel.getRow(function () {
          that.buildWhere(this, { "app_id": appId })
        });
        if (row?.id) {
          await cacheCast.setCacheWithTags(this.$cacheKey, cacheKey, row)
        }
      }
    } catch (error) {
      throw __filename + ':' + error.toString();
    }
    return row;
  },
}

module.exports = secretsHelper;