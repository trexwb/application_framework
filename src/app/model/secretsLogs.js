/*** 
 * @Author: trexwb
 * @Date: 2024-01-12 08:45:55
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:02:20
 * @FilePath: /git/application_framework/src/app/model/secretsLogs.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const dbInterface = require('@interface/database');
const baseModel = require('@model/base');
const CastInteger = require('@cast/integer');
const CastJson = require('@cast/json');

// 清理 dbInterface.prefix，防止特殊字符导致表名无效
const cleanedPrefix = dbInterface.prefix.replace(/[^a-zA-Z0-9_]/g, '');

const secretsLogsModel = {
  $table: `${cleanedPrefix}secrets_logs`,// 为模型指定表名
  $primaryKey: 'id', // 默认情况下指定'id'作为表主键，也可以指定主键名
  $fillable: [
    'secret_id',
    'source',
    'handle',
    'created_at',
    'updated_at'
  ],// 定义允许添加、更新的字段白名单，不设置则无法添加数据
  $guarded: ['id'],// 定义不允许更新的字段黑名单
  $casts: {
    secret_id: new CastInteger(),
    source: new CastJson(),
    handle: new CastJson()
  },
  $hidden: [],
  ...baseModel
}

module.exports = secretsLogsModel;