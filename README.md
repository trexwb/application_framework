# 技术路径
## 安装
### 本地执行
node版本不低于16，建议使用最新的node版本
> `npm i` 或 `yarn install`

> `npx cross-env NODE_ENV=production knex migrate:latest` 首次执行，需要迁移数据库

> `npx cross-env NODE_ENV=production knex seed:run` 导入默认数据，请正式服务慎重操作

首次安装
> `npm install` 或 `yarn install`

本地执行
> `npm run dev` 或 `yarn run dev`

正式环境执行
> `npm run start` 或 `yarn run start`

## nginx配置
如果使用fc将不需要nginx
```
upstream liujiayu_node {
    server 172.18.0.4:3000; # 本地前台,IP[172.18.0.4]根据实际更换
}

upstream liujiayu_consoloe {
    server 172.18.0.4:9001; # 本地中台,IP[172.18.0.4]根据实际更换
}

upstream liujiayu_manage {
    server 172.18.0.4:9002; # 本地后台,IP[172.18.0.4]根据实际更换
}

map $http_upgrade $connection_upgrade {
    default upgrade;
    "" close;
}

server {
    listen 80;
    listen [::]:80;
    server_name liujiaoyu.com *.liujiaoyu.com;
    error_log /var/log/nginx/liujoayu_com.log;
    access_log off;
     if ($host ~* "^([w]+)\.liujoayu\.com$") {
         return 301 https://liujiaoyu.com${request_uri};
     }
     return 301 https://${host}${request_uri};
 }
 server {
     listen 443 ssl http2;
     listen [::]:443 ssl http2;
     server_name liujiaoyu.com *.liujiaoyu.com;
     error_log /var/log/nginx/liujoayu_com.log;
     access_log off;

     ssl_certificate /var/www/cert/_.liujiaoyu.com.crt;
     ssl_certificate_key /var/www/cert/_.liujiaoyu.com.key;
     ssl_session_cache shared:SSL:10m;
     ssl_session_timeout 30m;
     ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
     ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
     ssl_prefer_server_ciphers on;

	if ($host ~* "^([w]+)\.liujoayu\.com$") {
        return 301 https://liujiaoyu.com${request_uri};
    }
    if ($request_method = "OPTIONS") {
        return 204;
    }
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "no-referrer";
    add_header X-Download-Options "noopen";
    add_header X-Permitted-Cross-Domain-Policies "none";
    add_header X-Robots-Tag "none";
    add_header Access-Control-Allow-Origin '*';
    add_header Access-Control-Allow-Methods "PUT, GET, DELETE, OPTIONS, POST";
    add_header Access-Control-Allow-Credentials true;
    add_header Access-Control-Allow-Headers "X-Requested-With, Content-Type, Authorization, App-Id, App-Secret, Site-Id, Auth-Token, Cache-Time";

    proxy_http_version 1.1;
    proxy_ssl_verify off;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Nginx-proxy true;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Scheme $scheme;
    proxy_set_header X-Real-PORT $remote_port;
    proxy_set_header Server-Protocol $server_protocol;
    proxy_set_header Server-Name $server_name;
    proxy_set_header Server-Addr $server_addr;
    proxy_set_header Server-Port $server_port;

    location /manage/ {
        proxy_pass http://liujiayu_manage${request_uri};
    }
    location /console/ {
        proxy_pass http://liujiayu_consoloe${request_uri};
    }
    location / {
        proxy_pass http://liujiayu_node${request_uri};
    }
}
```