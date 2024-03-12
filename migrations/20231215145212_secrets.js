/*** 
 * @Author: trexwb
 * @Date: 2024-03-12 10:44:45
 * @LastEditors: trexwb
 * @LastEditTime: 2024-03-12 10:44:46
 * @FilePath: /node/application_framework/migrations/20231215145212_secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-02-21 14:53:36
 * @FilePath: /laboratory/application/drive/migrations/20231215145212_secrets.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
/*
 * @Author: trexwb
 * @Date: 2023-12-15 22:52:12
 * @LastEditTime: 2023-12-15 23:46:20
 * @LastEditors: trexwb
 * @Description: In User Settings Edit
 * @FilePath: /node/damei/laboratory/applications/drive/migrations/20231215145212_secrets.js
 * 一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// require('dotenv').config();
// console.log(process.env);
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(`${process.env.DB_PREFIX}secrets`, (table) => {
        table.increments('id');
        table.string('title').notNullable().comment('密钥主体');
        table.string('app_id', 40).notNullable().comment('appid');
        table.string('app_secret', 40).notNullable().comment('密钥');
        table.json('permissions').nullable().comment('服务权限');
        table.json('extension').nullable().comment('扩展信息');
        table.specificType('status', 'TINYINT UNSIGNED').defaultTo(0);
        table.timestamps();
        table.timestamp('deleted_at').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable(`${process.env.DB_PREFIX}secrets`);
};
