exports.seed = async function (knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    knex(`${process.env.DB_PREFIX}servers`).del().then(function () {
        return knex(`${process.env.DB_PREFIX}servers`).insert(
            [{"id":1,"name":"账号管理","url":"http://127.0.0.1:3001","key":"account","app_id":"9924346402088699","app_secret":"E1xCKSrjBFV8ldhTMnSruv3HqvJQjY8Q","extension":{},"status":1,"created_at":"2024-01-19T01:23:59.000Z","updated_at":"2024-01-19T01:23:59.000Z","deleted_at":null},{"id":2,"name":"附件管理","url":"http://127.0.0.1:3002","key":"attachment","app_id":"7735102214108387","app_secret":"NVleUZo9ii7pNCv7JC7ZVPHTicmUvuZG","extension":{},"status":1,"created_at":"2024-01-19T01:26:22.000Z","updated_at":"2024-01-19T01:26:22.000Z","deleted_at":null},{"id":3,"name":"简易版文章管理","url":"http://127.0.0.1:3003","key":"simpleCMS","app_id":"8171391706160649","app_secret":"atWRLbCXJ4SXHdHr0LLPk1hH7Grq3WJ7","extension":{},"status":1,"created_at":"2024-01-19T01:26:22.000Z","updated_at":"2024-01-19T01:26:22.000Z","deleted_at":null}]
        );
    });
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};