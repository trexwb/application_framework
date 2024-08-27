/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 14:43:35
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 11:58:33
 * @FilePath: //application_framework/src/app/cast/datetime.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const moment = require('moment-timezone');
// const DEFAULT_LIMIT = 10; // 默认分页限制
// const MAX_LIMIT = 1000; // 最大分页限制
// const SHANGHAI_TZ = 'Asia/Shanghai'; // 时区常量
// const FORMAT = 'YYYY-MM-DD HH:mm:ss'; // 日期格式常量

// // 抽象日期格式化功能
// const formatDateTime = (date, timezone = SHANGHAI_TZ, format = FORMAT) => {
//   return date ? moment(date).tz(timezone).format(format) : null;
// };

class CastDatetime {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    // 尝试将字符串转换为 Date 对象
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return new Date(); // 返回当前时间作为默认值
    }
    return date;
  }

  set(value) {
    // 检查是否为 Date 对象，如果不是，则返回当前时间的 ISO 格式字符串
    if (!(value instanceof Date)) {
      return new Date().toISOString(); // 返回当前时间的 ISO 格式字符串
    }
    return value.toISOString(); // 返回 ISO 格式字符串
  }
}

module.exports = CastDatetime;