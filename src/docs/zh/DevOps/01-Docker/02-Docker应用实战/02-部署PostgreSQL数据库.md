# PostgreSQL部署

## 启动PostgreSQL容器

使用 Docker 启动 PostgreSQL 容器，这里我使用 MacOS 13.6.7 系统上的 Colima 启动的 Docker 容器启动的「ARM版本」。

```sh
docker run -d --name postgres16 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=12345678 \
    -p 5432:5432 \
    postgres:16.3
```

验证容器启动成功。

```shell
# 查看是否有名为 postgres16 的容器
docker ps
```

::: tip 提示
文档正在更新中...
:::