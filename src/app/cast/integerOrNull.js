/*** 
 * @Author: trexwb
 * @Date: 2025-01-03 09:59:47
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 09:59:49
 * @FilePath: /git/application_framework/src/app/cast/integerOrNull.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2025 by 杭州大美, All Rights Reserved. 
 */
class CastIntegerOrNull {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    if(!value) return null;
    // 尝试将字符串转换为整数
    const parsedInt = parseInt(value, 10);
    if (isNaN(parsedInt)) {
      return null; // 返回默认值 0
    }
    return parsedInt;
  }

  set(value) {
    if(!value) return null;
    if (typeof value === 'number' && !isNaN(value)) {
      return Number(value);
    } else if (typeof value === 'string' && value.trim() !== '') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : Number(parsed);
    }
    return null; // 或者根据需要返回其他默认值
  }
}

module.exports = CastIntegerOrNull;