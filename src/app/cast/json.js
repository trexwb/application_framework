/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 14:31:48
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 09:59:57
 * @FilePath: /git/application_framework/src/app/cast/json.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
class CastJson {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    try {
      return JSON.parse(JSON.stringify(value || {}));
    } catch (error) {
      return {};
    }
  }

  set(value) {
    try {
      return JSON.stringify(value || {});
    } catch (error) {
      return '{}';
    }
  }
}

module.exports = CastJson;