exports.seed = async function (knex) {
    await knex.raw('SET FOREIGN_KEY_CHECKS=0');
    knex(`${process.env.DB_PREFIX}sites`).del().then(function () {
        return knex(`${process.env.DB_PREFIX}sites`).insert(
            [{"id":1,"site_id":1,"name":"驱动器","hostname":"drive-dev.liujiaoyu.com","url":"https://drive-dev.liujiaoyu.com","seo":{"title":"六角鱼的驱动器","keywords":"驱动、微服务、RPC、低代码","description":"六角鱼（驱动器）是一款企业级代码管理平台，提供代码托管、代码搭建等功能，保护企业代码资产，实现安全、稳定、高效的使用生产。"},"extension":{},"created_at":"2024-03-04T01:57:39.000Z","updated_at":"2024-03-04T01:57:39.000Z","deleted_at":null},{"id":2,"site_id":2,"name":"学分制平台Q&A","hostname":"caajwcqa-dev.dmapp.cn","url":"http://caajwcqa-dev.dmapp.cn/","seo":{"title":"学分制平台Q&A","keywords":"中国美术学院、学分制、平台、Q&A","description":"中国美术学院学分制平台 Q&A 提供了关于该平台的常见问题解答，帮助学生更好地理解学分制系统的运作方式。"},"extension":{"icon":"/console/favicon.ico"},"created_at":"2024-03-04T01:57:46.000Z","updated_at":"2024-03-04T01:57:46.000Z","deleted_at":null},{"id":3,"site_id":2,"name":"学分制平台Q&A","hostname":"localhost","url":"http://localhost:9001/","seo":{"title":"学分制平台Q&A","keywords":"中国美术学院、学分制、平台、Q&A","description":"中国美术学院学分制平台 Q&A 提供了关于该平台的常见问题解答，帮助学生更好地理解学分制系统的运作方式。"},"extension":{"icon":"/console/favicon.ico"},"created_at":"2024-03-04T01:57:46.000Z","updated_at":"2024-03-04T01:57:46.000Z","deleted_at":null}]
        );
    });
    await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};