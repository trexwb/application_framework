/*** 
 * @Author: trexwb
 * @Date: 2024-03-12 10:44:55
 * @LastEditors: trexwb
 * @LastEditTime: 2024-04-16 11:46:03
 * @FilePath: /laboratory/Users/wbtrex/website/localServer/node/damei/package/node/application_framework/seeds/seed_secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
/*** 
 * @Author: trexwb
 * @Date: 2024-01-10 08:57:26
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-01 15:52:22
 * @FilePath: /laboratory/application/drive/seeds/seed_secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// require('dotenv').config();
// console.log(process.env);
const utils = require('@utils/index');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const total = await knex.from(`${process.env.DB_PREFIX}secrets`)
    .count('id', { as: 'total' })
    .first()
    .then((row) => {
      return row.total || 0
    }).catch(() => {
      return 0
    });
  if (total === 0) {
    // Deletes ALL existing entries
    await knex(`${process.env.DB_PREFIX}secrets`).del()
    await knex(`${process.env.DB_PREFIX}secrets`).insert([
      {
        title: '驱动器',
        app_id: utils.unique(16).toString(),
        app_secret: utils.generateRandomString(32),
        permissions: JSON.stringify(['admin']),
        extension: JSON.stringify({}),
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  }
};