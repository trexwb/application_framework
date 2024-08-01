/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-06-24 11:05:51
 * @FilePath: /drive/src/utils/status.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';

// const cacheCast = require('@cast/cache');
// const databaseCast = require('@cast/database');

// 200 OK: 请求成功，对于GET和POST请求的正常回应。
// 201 Created: 请求成功并且服务器创建了新的资源，常用于POST或PUT请求。
// 204 No Content: 服务器成功处理，但未返回内容。主要用于不需要返回内容的请求，如DELETE。
// 304 Not Modified: 资源未改变，主用于If-Modified-Since或If-None-Match的情况。
// 400 Bad Request: 请求参数有误，服务器无法解析。
// 401 Unauthorized: 请求需要用户验证，对于需要登录的网页或API，如果请求时没有登录或者登录超时，服务器可能会返回此响应。
// 403 Forbidden: 服务器理解请求客户端的请求，但是拒绝执行此请求。
// 404 Not Found: 请求的资源无法找到。
// 500 Internal Server Error: 服务器内部错误，无法完成请求。
// 返回码组成：状态码（3位数）+ 路由码|中间件（3位数，000表示中间件）+ 程序码（3位数定位程序问题） 如，状态码401，路由码004，程序码004，结果401004004
const status = {
  res: null,
  stream: {},
  msgMap: {
    200: 'Success',
    201: 'Created',
    204: 'No Content',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  },
  set(res) {
    status.res = res;
    return status;
  },
  dictionary(code) {
    status.stream = {
      msg: status.msgMap[code] || 'unknown error',
      code: code
    }
    return status;
  },
  parsing() {
    return Number((status.stream.code || 0).toString().substring(0, 3) || 200);
  },
  async response(data) {
    if (data) {
      if (Array.isArray(data) && data.length === 0) {
        status.stream.data = null;
      } else {
        status.stream.data = JSON.parse(JSON.stringify(data));
      }
      // if (status.stream.data.length <= 0) {
      //   delete status.stream.data;
      // }
    }
    if (status.res) {
      // // 输出前关闭数据库
      // const cacheCast = require('@cast/cache');
      // cacheCast.destroy();
      // // 输出前关闭数据库
      // const databaseCast = require('@cast/database');
      // databaseCast.destroy();
      return status.res.status(status.parsing()).send(status.stream);
    }
  }
}

module.exports = {
  msgMap: status.msgMap,
  set: status.set,
  dictionary: status.dictionary,
  parsing: status.parsing,
  response: status.response
};
