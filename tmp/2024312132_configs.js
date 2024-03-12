exports.seed = async function (knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    knex(`${process.env.DB_PREFIX}configs`).del().then(function () {
        return knex(`${process.env.DB_PREFIX}configs`).insert(
            [{"id":3,"key":"SEO","value":{"title":"","keywords":"","description":""},"created_at":"2024-01-04T23:42:04.000Z","updated_at":"2024-01-04T23:42:04.000Z","deleted_at":null},{"id":4,"key":"safe","value":{"level":"1","filter":[]},"created_at":"2024-01-04T23:42:04.000Z","updated_at":"2024-01-04T23:42:04.000Z","deleted_at":null}]
        );
    });
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};