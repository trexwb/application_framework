/*** 
 * @Author: trexwb
 * @Date: 2024-01-04 14:28:29
 * @LastEditors: trexwb
 * @LastEditTime: 2024-02-21 14:53:39
 * @FilePath: /laboratory/application/drive/migrations/20231216041718_secrets_logs.js
 * @Description: 
 * @一花一世界，一叶一如来
 * Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
// require('dotenv').config();
// console.log(process.env);
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(`${process.env.DB_PREFIX}secrets_logs`, (table) => {
        table.increments('id');
        table.integer('secret_id').unsigned(true).comment('密钥编号');
        table.foreign('secret_id').references('id').inTable(`${process.env.DB_PREFIX}secrets`);
        table.json('source').nullable().comment('操作前');
        table.json('handle').nullable().comment('操作内容');
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable(`${process.env.DB_PREFIX}secrets_logs`);
};
