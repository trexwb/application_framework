/*** 
 * @Author: trexwb
 * @Date: 2024-08-23 16:37:37
 * @LastEditors: trexwb
 * @LastEditTime: 2024-08-27 11:58:43
 * @FilePath: //application_framework/src/app/cast/string.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
class CastString {
  constructor(rules) {
    this.rules = rules;
  }
  get(value) {
    return value.toString();
  }

  set(value) {
    return value.toString();
  }
}

module.exports = CastString;