/*
 * @Author: trexwb
 * @Date: 2023-12-22 13:35:09
 * @LastEditors: trexwb
 * @LastEditTime: 2024-01-27 10:48:25
 * @FilePath: /damei/application/drive/src/config/knex.js
 * @Description: In User Settings Edit
 * 一花一世界，一叶一如来
 * Copyright (c) 2023 by 思考豆(杭州)科技有限公司, All Rights Reserved. 
 */
// Update with your config settings.
// require('dotenv').config();
// console.log(process.env.NODE_ENV, process.env);
const alias = require('@utils/alias');

if (process.env.DB_CONNECTION === 'mysql2') {
    module.exports = {
        write: {
            client: process.env.DB_CONNECTION,
            connection: {
                host: process.env.DB_WRITE_HOST || '',
                user: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                port: process.env.DB_WRITE_PORT || '',
                database: process.env.DB_DATABASE || '',
                timezone: process.env.TIMEZONE || '+08:00',
                charset: 'utf8mb4',
                ssl: {
                    rejectUnauthorized: false
                }
            },
            // wrapIdentifier: (
            //     value,
            //     origImpl,
            //     queryContext
            // ) => {
            //     console.log(value, queryContext)
            //     origImpl(`${process.env.DB_PREFIX || ''}${value}`)
            // },
            migrations: {
                tableName: `${process.env.DB_PREFIX}migrations`,
                directory: './migrations',
            },
            seeds: {
                directory: './seeds'
            },
            pool: {
                min: 2,
                max: 10000
            },
            acquireConnectionTimeout: 600,
            useNullAsDefault: true
        },
        read: {
            client: process.env.DB_CONNECTION,
            connection: {
                host: process.env.DB_READ_HOST || '',
                user: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                port: process.env.DB_READ_PORT || '',
                database: process.env.DB_DATABASE || '',
                timezone: process.env.TIMEZONE || '+08:00',
                charset: 'utf8mb4',
                ssl: {
                    rejectUnauthorized: false
                }
            },
            // wrapIdentifier: (
            //     value,
            //     origImpl,
            //     queryContext
            // ) => {
            //     console.log(value, queryContext)
            //     origImpl(`${process.env.DB_PREFIX || ''}${value}`)
            // },
            migrations: {
                tableName: `${process.env.DB_PREFIX}migrations`,
                directory: './migrations',
            },
            seeds: {
                directory: './seeds'
            },
            pool: {
                min: 2,
                max: 10000
            },
            acquireConnectionTimeout: 600,
            useNullAsDefault: true
        }
    }
}
if (process.env.DB_CONNECTION === 'sqlite' || process.env.DB_CONNECTION === 'sqlite3') {
    module.exports = {
        write: {
            client: process.env.DB_CONNECTION || 'sqlite',
            connection: {
                filename: alias.resolve(`@resources/database/${process.env.DB_FILE || 'database.db'}`),
                timezone: process.env.TIMEZONE || '+08:00',
                prefix: process.env.DB_PREFIX || ''
            },
            migrations: {
                tableName: `${process.env.DB_PREFIX}migrations`,
                directory: './migrations',
            },
            seeds: {
                directory: './seeds'
            },
            useNullAsDefault: true
        },
        read: {
            client: process.env.DB_CONNECTION || 'sqlite',
            connection: {
                filename: alias.resolve(`@resources/database/${process.env.DB_FILE || 'database.db'}`),
                timezone: process.env.TIMEZONE || '+08:00',
                prefix: process.env.DB_PREFIX || ''
            },
            migrations: {
                tableName: `${process.env.DB_PREFIX}migrations`,
                directory: './migrations',
            },
            seeds: {
                directory: './seeds'
            },
            useNullAsDefault: true
        }
    }
}
