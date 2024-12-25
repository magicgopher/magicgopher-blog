---
title: 部署MongoDB
author: MagicGopher
keywords: docker, mongodb
description: 介绍 Docker 部署 MongoDB
editLink: false
---

# MongoDB部署

## 启动MMongoDB容器

使用 Docker 启动 MongoDB 容器，这里我使用 MacOS 13.6.7 系统上的 Colima 启动的 Docker 容器启动的「ARM版本」。

```shell
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

部署 MongoDB 数据库控制面板。

```shell
docker run --name mongo-express -p 8081:8081 \
    --link mongodb \
    -e ME_CONFIG_MONGODB_SERVER=mongodb \
    -e ME_CONFIG_BASICAUTH_USERNAME=admin \
    -e ME_CONFIG_BASICAUTH_PASSWORD=12345678 \
    -d mongo-express:1.0.2
```

::: tip 提示
文档正在更新中...
:::