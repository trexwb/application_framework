/*** 
 * @Author: trexwb
 * @Date: 2024-08-22 15:11:15
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:00:31
 * @FilePath: /git/application_framework/src/app/helper/base.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */

'use strict';
const utils = require('@utils/index');
const cacheCast = require('@cast/cache');

// const Mutex = require('async-mutex').Mutex;
// const mutex = new Mutex();

const baseHelper = {
  buildWhere: function (that, where) {
    function applyWhereCondition(field, value) {
      if (Array.isArray(value)) {
        if (value.length > 0) that.whereIn(field, value);
      } else {
        that.where(field, value);
      }
    }
    that.where('id', '>', 0);
    if (where.id) {
      applyWhereCondition('id', where.id);
    }
    // that.whereIn('id', function() {
    //   this.select('user_id').from(usersRolesModel.$table).whereIn('role_id', where.role_id);
    // });
    // 多表联合查询效率低下时请将whereIn更换成whereExists如：
    // that.whereExists(function () {
    //   if (Array.isArray(where.role_id)) {
    //     if (where.role_id.length > 0) {
    //       this.select('user_id')
    //         .from(usersRolesModel.$table)
    //         .whereRaw(`${usersRolesModel.$table}.user_id = ${that.$table}.id`)
    //         .whereIn('role_id', where.role_id);
    //     }
    //   } else {
    //     this.select('user_id')
    //       .from(usersRolesModel.$table)
    //       .whereRaw(`${usersRolesModel.$table}.user_id = ${that.$table}.id`)
    //       .where('role_id', where.role_id);
    //   }
    // })
  },
  executeWithCache: async function (cacheKey, fn) {
    try {
      let result = await cacheCast.get(cacheKey);
      if (!result) {
        result = await fn();
        if (result) {
          cacheCast.setCacheWithTags(this.$cacheKey, cacheKey, result);
        }
      }
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAll: async function (where) { // await categoriesHelper.getList({keywords: '1',status: '0'});
    const sortWhere = utils.sortMultiDimensionalObject(where);
    const cacheKey = `${this.$cacheKey}[all:${JSON.stringify([sortWhere])}]`;
    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getAll((query) => this.buildWhere(query, where));
    });
  },
  getList: async function (where, order, _page, _pageSize) { // await secretsHelper.getList({keywords: '1',status: '0'});
    if (!this.$model) return null;
    const sortWhere = utils.sortMultiDimensionalObject(where);
    const sortOrder = utils.sortMultiDimensionalObject(order);
    const page = utils.safeCastToInteger(_page ?? 1);
    const pageSize = utils.safeCastToInteger(_pageSize ?? 10);
    const offset = utils.safeCastToInteger(!page ? 0 : pageSize * (page - 1));
    const cacheKey = `${this.$cacheKey}[list:${JSON.stringify([sortWhere, sortOrder, page, pageSize])}]`;

    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getList(
        (query) => this.buildWhere(query, where),
        order,
        pageSize,
        offset
      );
    });
  },
  getRow: async function (where) {
    if (!this.$model || !where) return null;

    const sortWhere = utils.sortMultiDimensionalObject(where);
    const cacheKey = `${this.$cacheKey}[row:${JSON.stringify([sortWhere])}]`;

    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getRow((query) => this.buildWhere(query, where));
    });
  },
  getId: async function (id) {
    if (!this.$model || !id) return null;

    const cacheKey = `${this.$cacheKey}[id:${id}]`;

    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getRow((query) => this.buildWhere(query, { id }));
    });
  },
  getTotal: async (where) => {
    if (!this.$model) return null;

    const sortWhere = utils.sortMultiDimensionalObject(where);
    const cacheKey = `${this.$cacheKey}[total:${JSON.stringify([sortWhere])}]`;

    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getTotal((query) => this.buildWhere(query, where));
    });
  },
  getSum: async (field, where) => {
    if (!this.$model) return null;

    const sortWhere = utils.sortMultiDimensionalObject(where);
    const cacheKey = `${this.$cacheKey}[sum:${JSON.stringify([field, sortWhere])}]`;

    return await this.executeWithCache(cacheKey, async () => {
      return await this.$model.getSum(field, (query) => this.buildWhere(query, where));
    });
  },
  update: async function (where, data) {
    if (!this.$model || !where || !data) return null;

    try {
      const affects = await this.$model.update((query) => this.buildWhere(query, where), data);
      await cacheCast.clearCacheByTag(this.$cacheKey);
      return affects;
    } catch (error) {
      throw __filename + ':' + error.toString();
    }
  },
  save: async function (data) {
    if (!this.$model || !data) return null;

    try {
      const affects = await this.$model.save(data);
      await cacheCast.clearCacheByTag(this.$cacheKey);
      return affects;
    } catch (error) {
      throw __filename + ':' + error.toString();
    }
  },
  restore: async function (where) {
    if (!this.$model || !where) return null;

    try {
      const affects = await this.$model.restore((query) => this.buildWhere(query, where));
      await cacheCast.clearCacheByTag(this.$cacheKey);
      return affects;
    } catch (error) {
      throw __filename + ':' + error.toString();
    }
  },
  delete: async function (where) {
    if (!this.$model || !where) return null;

    try {
      const affects = await this.$model.delete((query) => this.buildWhere(query, where));
      await cacheCast.clearCacheByTag(this.$cacheKey);
      return affects;
    } catch (error) {
      throw __filename + ':' + error.toString();
    }
  }
}
module.exports = baseHelper;