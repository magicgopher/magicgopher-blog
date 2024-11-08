---
title: Docker其他命令
author: MagicGopher
keywords: Docker,docker
---

# Docker其他命令

## docker cp 命令

> docker cp：用于容器与主机之间的数据拷贝。

*从容器中拷贝文件到主机*：

```sh
# OPTIONS：选项详细说明
# CONTAINER：容器名称或容器ID
# SRC_PATH：容器中的文件路径
# DEST_PATH：主机中的文件路径
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
```

*示例*：

```sh
docker cp mycontainer:/app/file.txt /local/path/file.txt
```

*从主机拷贝文件到容器*：

```sh
# OPTIONS：选项详细说明
# CONTAINER：容器名称或容器ID
# SRC_PATH：主机中的文件路径
# DEST_PATH：容器中的文件路径
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

*示例*：

```sh
docker cp /local/path/file.txt mycontainer:/app/file.txt
```

## docker top 命令

> docker top：查看容器中运行的进程信息，支持 ps 命令参数。

*语法格式*：

```sh
docker top --help

# CONTAINER：容器名称或容器ID
# [ps OPTIONS]：指可选的传递给 ps 命令的选项参数
Usage:  docker top CONTAINER [ps OPTIONS]

Display the running processes of a container

Aliases:
  docker container top, docker top
```

*示例*：

```sh
docker top mycontainer -o pid,comm
```

## docker info 命令

> docker info：查看 Docker 的系统信息。

*语法格式*：

```sh
docker info --help

# OPTIONS：选项参数
Usage:  docker info [OPTIONS]

Display system-wide information

Aliases:
  docker system info, docker info

# OPTIONS：选项详细说明
# --format string【简写：-f】：使用自定义模板格式化输出，有关使用模板格式化输出的更多信息，请参阅：https://docs.docker.com/go/formatting/
```

*示例*：

```sh
# 默认格式化输出
docker info

# json格式化输出
docker info --format "{{json .}}"
```

## docker logs 命令

> docker logs：命令用于查看容器的日志。

*语法格式*：

```sh
docker logs --help

Usage:  docker logs [OPTIONS] CONTAINER

Fetch the logs of a container

Aliases:
  docker container logs, docker logs

# OPTIONS：选项详细说明
# --details：显示提供给日志的额外详细信息
# --follow【简写：-f】：跟踪日志输出
# --since string：显示自时间戳记以来的日志（例如“2013-01-02T13：23：37Z”）或相对日志（例如“42m”，表示 42 分钟）
# --tail string【简写：-n】：从日志末尾显示的行数（默认“全部”）
# --timestamps【简写：-t】：显示时间戳
# --until string：显示时间戳之前的日志（例如“2013-01-02T13：23：37Z”）或相对时间戳（例如“42m”，表示 42 分钟）
```

*示例*：

```sh
# 显示更多容器日志的额外细节信息。
docker logs --details mycontainer

# 实时持续显示容器的日志输出。
docker logs -f mycontainer

# 分别显示从 2023-04-15 12:00:00 开始以及最近 30 分钟内的日志。
docker logs --since "2023-04-15T12:00:00" mycontainer
docker logs --since "30m" mycontainer

# 显示容器最新的 10 行日志和最新的 50 行日志。
docker logs -n 10 mycontainer
docker logs --tail "50" mycontainer

# 每行日志前显示时间戳。
docker logs -t mycontainer

# 显示在 2023-04-15 18:00:00 之前和 1 小时之前的日志
docker logs --until "2023-04-15T18:00:00" mycontainer
docker logs --until "1h" mycontainer
```

## docker system 命令

> docker system：命令是 Docker 提供的一组管理 Docker 系统的命令。

*语法格式*：

```shell
docker system --help

Usage:  docker system COMMAND

Manage Docker

Commands:
  df：显示 Docker 镜像、容器、卷等所占用的磁盘空间。可以帮助用户了解 Docker 系统中各个组件的占用情况，方便进行磁盘管理。
  events：监控 Docker 系统中发生的事件，包括容器、镜像、网络、卷等各种资源的创建、修改、删除等操作。可用于系统监控和故障排查。
  info：显示 Docker 系统的详细信息，包括版本、操作系统、CPUs、内存、存储驱动等。可以帮助用户了解 Docker 系统的当前状态。
  prune：清理 Docker 系统中未使用的资源，包括停止的容器、未使用的镜像、卷和网络。可以帮助用户释放磁盘空间。
```

::: tip 提示
文档正在更新中...
:::