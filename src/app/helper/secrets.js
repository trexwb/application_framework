/*** 
 * @Author: trexwb
 * @Date: 2024-01-12 08:45:55
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:00:39
 * @FilePath: /git/application_framework/src/app/helper/secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
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
        this.orWhereRaw('LOCATE(?, `title`) > 0', [where.keywords])
          .orWhereRaw('LOCATE(?, `app_id`) > 0', [where.keywords])
          .orWhereRaw('LOCATE(?, `extension`) > 0', [where.keywords])
      });
    }
  },
  getAppId: async function (appId) {
    if (!this.$model || !appId) return;
    const cacheKey = `${this.$cacheKey}[appid:${appId}]`;
    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getRow((query) => this.buildWhere(query, { "app_id": appId }));
    });
  }
}

module.exports = secretsHelper;