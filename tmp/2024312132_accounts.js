exports.seed = async function (knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    knex(`${process.env.DB_PREFIX}accounts`).del().then(function () {
        return knex(`${process.env.DB_PREFIX}accounts`).insert(
            [{"id":1,"nickname":"超级管理员","uuid":"f847ec1c-8735-451a-8f00-d4f637997aaa","secret":"TIvczHlSEQzjlvs5fprWNBhrSlq85xQe","remember_token":"9TFDqwtMRFhSSoxyfZmwuhkJVgzC8viztwoQYwRYJMKO803iOdWvusvOtwpX25YE","extension":[],"status":1,"created_at":"2024-01-04T23:42:04.000Z","updated_at":"2024-03-06T00:48:51.000Z","deleted_at":null}]
        );
    });
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};