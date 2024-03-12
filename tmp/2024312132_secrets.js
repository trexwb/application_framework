exports.seed = async function (knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    knex(`${process.env.DB_PREFIX}secrets`).del().then(function () {
        return knex(`${process.env.DB_PREFIX}secrets`).insert(
            [{"id":1,"title":"超管","app_id":"4215596816531225","app_secret":"524wbc4HgFhkGLlzcHXR8XBDgBafAneu","permissions":["admin"],"extension":{"siteId":1},"status":1,"created_at":"2024-01-04T23:42:04.000Z","updated_at":"2024-01-04T23:42:04.000Z","deleted_at":null},{"id":2,"title":"教务处QA系统","app_id":"1579519205576114","app_secret":"BXXGLpSy4SldiwPLj2AKoctFZgl1iGzd","permissions":["site"],"extension":{"siteId":2},"status":1,"created_at":"2024-01-04T23:42:04.000Z","updated_at":"2024-01-04T23:42:04.000Z","deleted_at":null}]
        );
    });
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};