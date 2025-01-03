/*** 
 * @Author: trexwb
 * @Date: 2025-01-03 10:02:48
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 10:02:49
 * @FilePath: /git/application_framework/src/app/helper/process.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2025 by 杭州大美, All Rights Reserved. 
 */
'use strict';
// 模块缓存
const accountsService = require('@service/accounts');
const attachmentservice = require('@service/attachments');
const standardservice = require('@service/standards');


const processHelper = {
  accountsOperation: async (operation) => {
    try {
      const client = await accountsService.connectionService();
      if (!client) throw new Error('Service Error');
      const result = await operation(client);
      return await accountsService.decryptData(result);
    } catch (error) {
      throw new Error(`${operation.toString()}:${error}`);
    } finally {
      // 添加资源释放逻辑
    }
  }
}
module.exports = processHelper;