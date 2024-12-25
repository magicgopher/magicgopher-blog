---
title: Docker数据卷
author: MagicGopher
keywords: docker, docker volume, docker数据卷
description: 介绍 Docker 数据卷
editLink: false
---

# Docker数据卷

## 数据卷

Docker 容器在启动时会创建一个新的文件系统，并在容器停止时将其删除。如果你在容器中存储了重要的数据，当容器停止或删除时，这些数据也会丢失。为了解决这个问题 Docker 引入了 volume 的概念。

*语法格式*：

```sh
docker volume COMMAND

# COMMAND详细说明
# create：创建一个数据卷。
# inspect：显示一个或多个数据卷的详细信息。
# ls：列出所有数据卷。
# prune：删除所有未使用的数据卷。
# rm：删除一个数据卷。
```

## 创建一个数据卷

*示例*：

```sh
# 创建一个名为postgres_data的数据卷
docker volume create postgres_data

# 使用 postgres_data 数据卷
docker run -d --name postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=12345678 \
    -v postgres_data:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:16.3

# 查看数据卷信息
docker volume inspect 数据卷名称或者ID

# 使用 docker inspect 查看容器信息
# docker inspect -f {{.Mounts}} 容器名称或者ID
docker inspect -f '{{range .Mounts}}{{printf "Type: %s\nName: %s\nSource: %s\nDestination: %s\nDriver: %s\nMode: %s\nRW: %t\nPropagation: %s\n" .Type .Name .Source .Destination .Driver .Mode .RW .Propagation}}{{end}}' 容器名称或者ID
```

## 显示所有数据卷

*示例*：

```sh
docker volume ls

# 输出如下
DRIVER    VOLUME NAME
local     postgres_data
```

输出内容详细说明：
- `DRIVER`： 数据卷驱动程序。
- `VOLUME NAME`：数据卷的名称。

## 删除一个数据卷

*语法格式*：

```sh
docker volume rm 数据卷名称或者ID
```

*示例*：

```sh
# 删除一个数据卷
docker volume rm postgres_data
```

## 清理所有未使用的数据卷

*语法格式*：

```sh
docker volume prune

# 输出如下 这里输入 y 表示清理所有未使用的数据卷
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N]
```

*示例*：

```sh
# 启动一个 postgres 容器，这里使用匿名数据卷
docker run -d --name postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=12345678 \
    -v /var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:16.3

# 查看正在运行的容器
docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS         PORTS                                       NAMES
1790877c3e25   postgres:16.3   "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   postgres

# 查看所有数据卷
docker volume ls
DRIVER    VOLUME NAME
local     c17a5780755685a36f8c00d72bd4d79a77d6dc50ecf12aa27ca7d743289a86e9

# 将postgres容器停止并删除
docker stop postgres && docker rm postgres

# 再次查看所有数据卷
docker volume ls
DRIVER    VOLUME NAME
local     c17a5780755685a36f8c00d72bd4d79a77d6dc50ecf12aa27ca7d743289a86e9

# 清理所有未使用的数据卷
docker volume prune
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
c17a5780755685a36f8c00d72bd4d79a77d6dc50ecf12aa27ca7d743289a86e9

Total reclaimed space: 40.24MB

# 再次查看所有数据卷
docker volume ls
DRIVER    VOLUME NAME
```

## 查看数据卷的详细信息

*语法格式*：

```sh
docker volume inspect 数据卷名称或者ID
```

*示例*：

```sh
# 启动一个 postgres 容器，这里使用匿名数据卷
docker run -d --name postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=12345678 \
    -v /var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:16.3

# 查看所有数据卷
docker volume ls
DRIVER    VOLUME NAME
local     031520e8fafcc5f57fe86e6f25dfc7163cb26e8e58fb2e18ad3aa72e93a2116b # postgres容器的数据卷

# 查看数据卷的详细信息
docker volume inspect 031520e8fafcc5f57fe86e6f25dfc7163cb26e8e58fb2e18ad3aa72e93a2116b
[
    {
        "CreatedAt": "2024-07-16T14:12:54+08:00",
        "Driver": "local",
        "Labels": {
            "com.docker.volume.anonymous": ""
        },
        "Mountpoint": "/var/lib/docker/volumes/031520e8fafcc5f57fe86e6f25dfc7163cb26e8e58fb2e18ad3aa72e93a2116b/_data",
        "Name": "031520e8fafcc5f57fe86e6f25dfc7163cb26e8e58fb2e18ad3aa72e93a2116b",
        "Options": null,
        "Scope": "local"
    }
]
```

数据卷的详细信息内容说明：
- `CreatedAt`：该数据卷被创建的时间。
- `Driver`：管理该数据卷的存储驱动程序。默认是 local 驱动程序，表示本地存储。
- `Labels`：用户为该数据卷添加的标签。可以通过 docker volume create --label 或 docker volume update --label 命令添加标签。
- `Mountpoint`：该数据卷在宿主机上的实际挂载路径。
- `Name`：数据卷的名称。
- `Options`：在创建数据卷时指定的额外选项。比如使用 docker volume create -o type=nfs -o device=:/path/to/nfs/share -o o=addr=10.10.10.10 nfs-vol 创建的 NFS 数据卷，这里 Options 字段会显示相应的配置选项。
- `Scope`：数据卷的作用域。通常是 local 表示该数据卷仅在当前节点上可用。对于集群环境，可能会是 global 表示该数据卷在整个集群中可用。