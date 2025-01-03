/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 16:37:37
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:00:02
 * @FilePath: /git/application_framework/src/app/cast/string.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
class CastString {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    return value === false || value === null ? value : (value || '').toString();
  }

  set(value) {
    return value === false || value === null ? value : (value || '').toString();
  }
}

module.exports = CastString;