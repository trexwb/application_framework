exports.seed = async function (knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    knex(`${process.env.DB_PREFIX}codes`).del().then(function () {
        return knex(`${process.env.DB_PREFIX}codes`).insert(
            [{"id":1,"account_id":1,"secret":"501572","valid_time":1709864530,"created_at":"2024-02-01T10:53:23.000Z","updated_at":"2024-03-07T18:52:10.000Z"}]
        );
    });
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};