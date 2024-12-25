---
title: Redis部署
author: MagicGopher
keywords: docker, redis
description: 介绍 Docker 部署 Redis 数据库
editLink: false
---

# Redis部署

## 启动Redis容器

使用 Docker 启动一个 Redis 容器，这里我使用 MacOS 13.6.7 系统上的 Colima 启动的 Redis 容器启动的「ARM版本」。

```shell
# 启动 Redis 容器
docker run --name redis7 -p 6379:6379 -d redis:7.4-rc2

# 启动 Redis 容器，并设置密码
docker run --name redis7 -p 6379:6379 -d redis:7.4-rc2 --requirepass 12345678
```

验证容器是否正常启动。

```shell
# 查看是否有名为 redis7 的容器
docker ps
```

进入容器内部，使用 `redis-cli` 命令，连接 Redis 服务器。

```shell
# docker exec -it 容器ID或者容器名称 bash
docker exec -it redis7 bash

# 使用 redis-cli 命令连接 Redis 服务器（没有设置密码）
# redis-cli -h IP地址 -p 端口号
redis-cli -h 127.0.0.1 -p 6379

# 使用 redis-cli 命令连接 Redis 服务器（设置了密码）
redis-cli -h 127.0.0.1 -p 6379
auth 密码
```

## 使用数据卷持久化容器数据

### 创建数据卷需要的目录

创建redis目录并且切换到该目录。

```shell
mkdir redis && cd redis
```

在 redis 目录下创建 redis_volumes 目录，并切换到该目录。

```shell
mkdir redis_volumes && cd redis_volumes
```

在 redis_volumes 目录下创建 data、log、conf 目录。
```shell
mkdir data log conf
```

### 创建 redis.conf 配置文件

在 conf 目录下创建 redis.conf 配置文件。

详细的配置文件内容可以参考：[官方 Redis 配置文件](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)。

```shell
################################## GENERAL ##################################
bind *
port 6379
pidfile /var/run/redis_6379.pid
protected-mode yes
requirepass 12345678
timeout 0
tcp-keepalive 300
loglevel notice
logfile /log/redis.log

################################# REPLICATION #################################
slave-serve-stale-data yes
slave-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-disable-tcp-nodelay no

##################################### RDB #####################################
dbfilename dump.rdb
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dir /data

##################################### AOF #####################################
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
aof-load-truncated yes
aof-use-rdb-preamble no
```

### 启动 Redis 容器

使用以下命令启动 Redis 容器。

```shell
docker run -p 6379:6379 --name redis7 \
        -v $(pwd)/redis_volumes/conf/redis.conf:/etc/redis/redis.conf \
        -v $(pwd)/redis_volumes/data:/data \
        -v $(pwd)/redis_volumes/log:/log \
        -d redis:7.4-rc2 \
        /bin/bash -c "redis-server /etc/redis/redis.conf"
```

## Docker Compose 部署 Redis

### 目录结构说明

文件目录结构如下：

```shell
redis
    ├── redis.yaml
    └── redis_volumes
        ├── conf
        │   └── redis.conf
        ├── data
        └── log
```

目录结构详细说明：
- `redis.yaml`：Docker Compose 配置文件，用于启动 Redis 容器。
- `redis_volumes`：数据卷目录，用于存储 Redis 容器映射数据。
- `conf`：Redis 配置文件目录，用于存储 Redis 配置文件。
- `data`：Redis 数据目录，用于存储 Redis 数据文件。
- `log`：Redis 日志目录，用于存储 Redis 日志文件。

### 创建目录和赋予权限

创建 redis_volumes 并切换到 redis_volumes 目录下

```shell
mkdir redis_volumes && cd redis_volumes
```

在 redis_volumes 目录下创建 conf、data、log 目录。

```shell
mkdir conf data log
```

在 conf 目录下创建 redis.conf 配置文件，然后再使用 vim 来编辑 redis.conf 配置文件

```shell
cd redis.conf && touch redis.conf
```

以下是 `redis.conf` 配置文件的内容：

[请参考上面👆的redis.conf配置文件](#创建-redis-conf-配置文件)

然后给 redis.conf 文件添加权限。

```shell
chmod 644 redis.conf
```

再给 `redis_volumes` 目录下的 `data`、`log` 目录添加权限。

```shell
chmod -R 777 data log
```

### 启动容器

创建并编辑 `redis.yaml` 配置文件，内容如下：

```yaml
services:
  redis:
    image: redis:7.4-rc2
    container_name: redis7.4
    restart: always
    # command: ["/bin/bash", "-c", "redis-server /etc/redis.conf"]
    command: ["redis-server", "/etc/redis.conf"]
    volumes:
      - ./conf/redis.conf:/etc/redis.conf
      - ./data:/data
      - ./log:/log
    # environment:
      # - TZ=Asia/Shanghai
      # - LANG=en_US.UTF-8
      # - LC_ALL=C
    ports:
      - "6379:6379"

# container network
networks:
  default:
    name: redis-net
    driver: bridge
```

切换到 redis 目录下，然后执行以下命令启动 Redis 容器。

```shell
docker-compose -f redis.yaml up -d
```

测试Redis是否启动成功，使用 `docker exec` 命令进入容器内部。

```shell
# docker exec -it 容器ID或者容器名称 bash
docker exec -it redis7.4 bash

# 使用 redis-cli 命令连接 Redis 服务器（没有设置密码）
redis-cli -h 127.0.0.1 -p 6379

# 使用 redis-cli 命令连接 Redis 服务器（设置了密码）
redis-cli -h 127.0.0.1 -p 6379
auth 12345678
```