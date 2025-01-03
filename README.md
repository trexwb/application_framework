# 开发日志
## 1.1.1 （2025-12-03）
- 更新 package.json 依赖版本
- 优化 boolean、cache、datetime 等类型转换逻辑
- 重构 baseHelper 中的缓存处理逻辑，提高可读性和维护性
- 优化 secretsHelper 中的查询逻辑
- 修复 RedisCache 中的连接和错误处理
- 优化 DatabaseInterface 中的数据库连接管理
- 简化 LogService 中的日志记录逻辑
- 移除未使用的 notify 中间件
- 重构 response 中间件，提高错误处理和响应构建的可读性

## 1.1.0 （2024-08-01）
升级了底层的很多业务逻辑，比如增加了队列、计划任务、事务，数据库连接的调整等

## 多语言包（2024-02-29）
### 功能说明
- 增加多站点能力

### 数据库调整
```
npx knex migrate:make sites
npx knex seed:make seed_sites
```
> `npm i`

> `npx knex migrate:latest`

> `npx knex seed:run --specific=seed_sites.js` 导入默认数据，请正式服务慎重操作

- `sites` 站点表

## 创建（2024-01-12）
### 基础数据
```
npx knex migrate:make config
npx knex migrate:make servers
npx knex migrate:make servers_logs
npx knex migrate:make secrets
npx knex migrate:make secrets_logs
npx knex migrate:make account
npx knex migrate:make account_logs
npx knex migrate:make client_logs
npx knex migrate:make code
```

- `config` 基础配置表
- `servers` 微服务表
- `servers_logs` 微服务变更记录
- `secrets` API访问密钥
- `secrets_logs` 密钥变更记录
- `account` 后台账号
- `account_logs` 后台账号变更记录
- `client_logs` 客户端日志
- `code` 短数字登录

# 技术路径
## 安装
### 本地执行
node版本不低于16，建议使用最新的node版本
> `npm i` 或 `yarn install`

> `npx cross-env NODE_ENV=production knex migrate:latest` 首次执行，需要迁移数据库

> `npx cross-env NODE_ENV=production knex seed:run` 导入默认数据，请正式服务慎重操作

首次安装需要执行上面代码

本地执行
> `npm run dev` 或 `yarn run dev`

正式环境执行
> `npm run start` 或 `yarn run start`

### 创建库
有新的开发内容时通过命令创建数据库，请不要直接改动数据库
> `npx cross-env NODE_ENV=production knex migrate:make 表名`

需要加入新的数据
> `npx knex seed:make seed_表名`

### 修改表结构
>  `npx cross-env NODE_ENV=production knex migrate:make add_fields_to_secrets`

### 数据迁移
迁移文件的结构大致如下哦
```
exports.up = function(knex) {
    return knex.schema.alterTable('secrets', (table) => {
        table.json('source').nullable().comment('操作前').alter();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('secrets_logs', (table) => {
        table.dropColumn('name');
    });
}
```

- `config` 基本配置
- `servers` 可用服务
- `servers_logs` 服务变更记录
- `secrets` API访问密钥
- `secrets_logs` 密钥变更记录
- `account` 管理员账号
- `account_logs` 管理员账号变更记录
- `client_logs` 客户端调用错误日志
- `code` 动态码

### 数据备份
`npx cross-env NODE_ENV=production node backup.js`
备份的文件会存储到`/src/resouces/database/`目录下，需要时可以复制到`/seeds/`目录中作为数据种子导入，实现数据恢复

### docker
docker使用node的需要注意，node中是没有数据库ip的，需要手动修改，如：`echo "172.18.0.6   local_mysql.com" >> /etc/hosts`，`172.18.0.6`为docker中mysql的IP地址，`local_mysql.com`为数据库域名访问地址（由于mysql插件的安全要求，ip访问数据库会产生安全提醒）

## 服务
### 驱动器
驱动器主要是调用各个服务来完成网站接口开发的主体，主要工作就是调用其他服务实现任意功能的接口集合
### 目录
- `package.json`中声明好所有Aliase目录，方便程序中直接调用路径文件，而不是从相对路径去查找文件
- `migrations` 提供`knex`对数据结构进行迁移的文件，未来数据库的修改也必须在此完成
- `replace` 提供FC等serverless平台用于替换env或者需要替换的文件模版
- `seeds` 提供`knex`对数据进行迁移的文件，确定的列修改也必须在此完成
- `src` 服务主体文件
    - `app` 程序主体
    - `config` 相关配置文件，密码等文件会通过env配置，此处主要是将env文件中的内容读取到常量
    - `resources` 资源目录，如模版sqlite
    - `static` 静态资源，通过http://xxxx/static/可直接访问，建议尽量使用oss，此处仅用于防止万一用到
    - `utils` 工具
- `tmp` 上传的临时文件（通过又拍或oss之后本地不会上传文件，且通过FC等serverless平台，tmp中的文件会因为实例被释放而删除）

### 调用其他服务
其他应用调用账号管理服务的方式，如调用账号管理
```
// 统一采用hprose库提供的RPC方式，可以支持多种语言
const hprose = require("hprose");
// 统一使用加密方式
const cryptTool = require('@utils/cryptTool');

const serversHelper = require('@helper/servers');
// hprose 调用服务地址
const serverRow = await serversHelper.getKey('account');
const client = hprose.Client.create(serverRow.url);

// 时间戳
const timeStamp = Math.floor(Date.now() / 1000).toString();
const newSecret = cryptTool.md5(cryptTool.md5(serverRow.app_id + timeStamp) + serverRow.app_secret) + timeStamp

await client.setHeader("App-Id", serverRow.app_id);
await client.setHeader("App-Secret", newSecret);
// siteId 表示要操作的站点
await client.setHeader("Site-Id", siteId);

if (process.env.mode === 'strict') { // 如果采用严格模式
    // 需要先从rpc_getFunctions
    const proxy = await client.useService(['rpc_getFunctions']);
    let fns = await proxy.rpc_getFunctions();
    // 获得可以使用的全部方法
    if (fns && fns.iv) { // 有加密返回时解密
        fns = await decryptData(fns);
    }
    if (!fns || fns.error) {
        return fns.error || fns || false;
    }
    proxy = await client.useService([...new Set([...serverRow.extension?.fn, ...fns])]);
} else {
    proxy = await client.useService();
}
// 调用登录方法
let result = proxy.signIn(账号, 密码)
// 返回数据如果有加密处理，需要把方法获取到的数据进行解密，`result.iv`存在时表示有加密
// 解密防范
const decryptData = async (_data) => {
    if (!accountService.serverRow.id) return false;
    if (_data.encryptedData, _data.iv) {
        return cryptTool.decrypt(_data.encryptedData, accountService.serverRow?.app_secret, _data.iv);
    }
    return _data;
}
if (result && result.iv) { // 有加密返回时解密
    result = await decryptData(result);
}
```

## 错误码查询
### 状态码
| 返回码 | 说明 |
| :----: | :---- |
| 200: | Success |
| 201: | Created |
| 204: | No Content |
| 304: | Not Modified |
| 400: | Bad Request |
| 401: | Unauthorized |
| 403: | Forbidden |
| 404: | Not Found |
| 500: | Internal Server Error |

### 返回码
| 返回码 | 状态码 | 说明 |
| :----: | :---- | :---- |
| 401000001 | 401 | Secret Timeout |
| 401000002 | 401 | Secret Not Empty |
| 401000003 | 401 | Secret Invalid |