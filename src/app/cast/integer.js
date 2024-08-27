/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 14:37:47
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 11:58:38
 * @FilePath: //application_framework/src/app/cast/integer.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
class CastInteger {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    // 尝试将字符串转换为整数
    const parsedInt = parseInt(value, 10);
    if (isNaN(parsedInt)) {
      return 0; // 返回默认值 0
    }
    return parsedInt;
  }

  set(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      return Number(value);
    } else if (typeof value === 'string' && value.trim() !== '') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : Number(parsed);
    }
    return 0; // 或者根据需要返回其他默认值
  }
}

module.exports = CastInteger;