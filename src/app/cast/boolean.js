/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 14:31:48
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 11:58:26
 * @FilePath: /lication_framework/src/app/cast/boolean.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
class CastBoolean {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    // 将字符串或其他类型的值转换为布尔值
    if (typeof value === 'string') {
      value = value.trim().toLowerCase();
      if (value === 'true' || value === '1' || value === '') {
        return true;
      } else if (value === 'false' || value === '0') {
        return false;
      }
      return false; // 返回默认值 false
    }
    return !!value; // 将非字符串类型的值转换为布尔值
  }

  set(value) {
    // 检查是否为布尔值，如果不是，则返回默认值 "false"
    if (typeof value !== 'boolean') {
      return 'false'; // 返回默认值 "false"
    }
    return value ? 'true' : 'false'; // 返回 "true" 或 "false" 字符串
  }
}

module.exports = CastBoolean;