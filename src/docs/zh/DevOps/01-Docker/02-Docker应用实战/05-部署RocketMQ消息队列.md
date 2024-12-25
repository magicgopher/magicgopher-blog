---
title: RocketMQ部署
author: MagicGopher
keywords: docker, rocketmq
description: 介绍 Docker 部署 RocketMQ
editLink: false
---

# RocketMQ部署

## x86架构部署

::: tip 提示
后面补齐在x86机器部署RocketMQ
:::

## Arm架构部署

### RocketMQ镜像构建

1. 首先需要构建RocketMQ镜像，需要下载[官方RocketMQ构建脚本](https://github.com/apache/rocketmq-docker)。

::: code-group
```shell [GitHub]
git clone https://github.com/apache/rocketmq-docker.git
```

```shell [镜像加速]
git clone https://mirror.ghproxy.com/https://github.com/apache/rocketmq-docker.git
```
:::

2. 进入到刚刚git clone的目录下【rocketmq-docker目录】，再切换到 `image-build` 目录下，执行以下命令：

::: code-group
```shell [alpine]
# RMQ-VERSION：RocketMQ版本号，例如4.9.2
# BASE-IMAGE：镜像基础镜像，例如alpine、ubuntu
sh build-image.sh RMQ-VERSION BASE-IMAGE

# 示例
sh build-image.sh 4.9.2 alpine
```

```shell [ubuntu]
# RMQ-VERSION：RocketMQ版本号，例如4.9.2
# BASE-IMAGE：镜像基础镜像，例如alpine、ubuntu
sh build-image.sh RMQ-VERSION BASE-IMAGE

# 示例
sh build-image.sh 4.9.2 ubuntu
```
:::

3. 关于 RocketMQ 镜像构建有哪些版本可以构建，可以参考[官方文档](https://archive.apache.org/dist/rocketmq/)。

4. 构建完成后，可以使用 docker ps 命令查看构建的镜像。

```shell
docker ps

REPOSITORY                     TAG           IMAGE ID       CREATED         SIZE
apache/rocketmq                4.9.8         c3f8c664f735   3 weeks ago     560MB
```

### RocketMQ Dashboard 镜像构建

1. 构建rocketmq-dashboard镜像，将 rocketmq-dashboard 源码使用 `git clone` 到本地。

::: code-group
```shell [GitHub]
git clone https://github.com/apache/rocketmq-dashboard.git
```

```shell [镜像加速]
git clone https://github.com/apache/rocketmq-dashboard.git
```
:::

2. 切换到 `rocketmq-dashboard` 目录下执行 `mvn` 构建命令获取到 `rocketmq-dashboard-1.0.1-SNAPSHOT.jar`，该文件在构建好的 `target` 目录下。

```shell
mvn clean package -Dmaven.test.skip=true
```

1. 将 `rocketmq-dashboard-1.0.1-SNAPSHOT.jar` 拷贝到 `docker` 目录下，需要将Dockerfile的FROM基础镜像改为 `eclipse-temurin:8-jdk` 才能支持ARM架构的机器运行，最后执行构建命令。

```shell
docker build -t apache/rocketmq-dashboard:1.0.1 .
```

### Docker 部署 RocketMQ

#### 部署 NameServer

1. 以下是启动 RocketMQ NameServer 的 docker 命令。

```shell
docker run -p 9876:9876 --name rmq-nameserver \
        -d apache/rocketmq:4.9.8 \
        sh mqnamesrv
```

#### 部署 Broker

2. 以下是启动 RocketMQ Broker 的 docker 命令。

```shell
docker run -p 10909:10909 -p 10911:10911 -p 10912:10912 --name rmq-broker \
        --link rmq-nameserver:nameserver \
        -e "NAMESRV_ADDR=nameserver:9876" \
        -d apache/rocketmq:4.9.8 \
        sh mqbroker
```

#### 部署 RocketMQ Dashboard

3. 构建RocketMQ Dashboard镜像。

[请参考上面👆构建RocketMQ Dashboard镜像](#rocketmq-dashboard-镜像构建)

4. 启动 RocketMQ Dashboard。

```shell
docker run -p 8080:8080 --name rocketmq-dashboard \
        --link rmq-nameserver:nameserver \
        -e "JAVA_OPTS=-Drocketmq.config.namesrvAddrs=nameserver:9876 -Drocketmq.config.isVIPChannel=false" \
        -d apache/rocketmq-dashboard:1.0.1
```

然后访问 `http://IP地址:8080`

![image-01](/images/docs/Docker/Docker应用实战/assets/image-01.png)

### Docker Compose 部署

#### 目录结构说明

```shell
rocketmq
    ├── broker
    │   ├── broker.yaml
    │   ├── conf
    │   ├── logs
    │   └── store
    ├── dashboard
    │   └── dashboard.yaml
    └── nameserver
        ├── logs
        └── nameserver.yaml
```

目录结构详细说明：
- `broker`：RocketMQ Broker 文件目录。
  - `broker.yaml`：Docker Compose 配置文件，用于启动 RocketMQ Broker 容器。
  - `conf`：broker配置文件目录。
  - `logs`：broker日志目录。
  - `store`：broker存储目录。
- `dashboard`：RocketMQ Dashboard 文件目录。
  - `dashboard.yaml`：Docker Compose 配置文件，用于启动 RocketMQ Dashboard 容器。
- `nameserver`： RocketMQ NameServer 文件目录。
  - `logs`：NameServer日志目录。
  - `nameserver.yaml`：Docker Compose 配置文件，用于启动 RocketMQ NameServer 容器。 

#### 部署 NameServer

创建 `nameserver` 目录，并切换到 `nameserver` 目录下。

```shell
mkdir nameserver && cd nameserver
```

在 `nameserver` 目录下创建 `logs` 目录。

```shell
mkdir logs
```

给 `nameserver` 目录下的 `logs` 目录添加权限。

```shell
chmod -R 777 logs
```

在 `nameserver` 目录下创建 `nameserver.yaml` 文件，内容如下：

```yaml
services:
  # nameserver
  nameserver:
    image: apache/rocketmq:4.9.8
    container_name: rmq-nameserver
    restart: unless-stopped
    ports:
      - "9876:9876"
    environment:
      TZ: "Asia/Shanghai"
      JAVA_OPT: "-server -Xms256m -Xmx256m -Xmn512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
    volumes:
      - ./logs:/home/rocketmq/logs
    command: sh mqnamesrv

# rocketmq network
networks:
  default:
    driver: bridge
    name: rmq-net
```

启动 RocketMQ NameServer 容器。

```shell
docker-compose -f nameserver.yaml up -d
```

启动成功后，可以通过 `docker ps` 命令查看 NameServer 容器是否启动成功。

#### 部署 Broker

创建 `broker` 目录，并切换到 `broker` 目录下。

```shell
mkdir broker && cd broker
```

在 `broker` 目录下创建 `logs`、`conf`、`store` 目录。

```shell
mkdir logs conf store
```

给 `broker` 目录下的 `logs`、`conf`、`store` 目录添加权限。

```shell
chmod -R 777 logs conf store
```

在 `conf` 目录下创建 `broker.conf` 文件，内容如下：

```shell
# 所属集群名称，如果节点较多可以配置多个
brokerClusterName = RocketMQ-Cluster

# broker名称，master和slave使用相同的名称，表明他们的主从关系
brokerName = broker

# 0表示 Master，大于 0 表示不同的 slave
brokerId = 0

# 表示几点做消息删除动作，默认是凌晨4点
deleteWhen = 04

# 在磁盘上保留消息的时长，单位是小时
fileReservedTime = 48

# 有三个值：SYNC_MASTER，ASYNC_MASTER，SLAVE；同步和异步表示 Master 和 Slave 之间同步数据的机制；
brokerRole = ASYNC_MASTER

# 刷盘策略，取值为：ASYNC_FLUSH、SYNC_FLUSH、MEMMAP、MMAP 表示同步刷盘和异步刷盘；
# ASYNC_FLUSH：异步刷新磁盘。这是默认的设置，性能较好，但可能会有数据丢失的风险。
# SYNC_FLUSH：同步刷新磁盘。这种方式能够保证数据的可靠性，但性能会较差，因为每次写入都需要等待磁盘完成。
# MEMMAP：内存映射刷新磁盘。这种方式将消息缓存在内存中，定期同步到磁盘，性能较好且数据可靠性较高。
# MMAP：内存映射刷新磁盘。这与 MEMMAP 类似，也是将消息缓存在内存中，定期同步到磁盘,但实现方式略有不同。
flushDiskType = ASYNC_FLUSH

# 设置 broker 节点所在服务器的 ip 地址、物理 ip，不能用127.0.0.1、localhost、docker内网ip
brokerIP1 = 192.168.0.100
```

给 `broker` 目录下的 `broker.conf` 文件添加权限。

```shell
chmod 644 broker.conf
```

在 `broker` 目录下创建 `broker.yaml` 文件，内容如下：

```yaml
services:
  broker:
    image: apache/rocketmq:4.9.8
    container_name: rmq-broker
    restart: unless-stopped
    ports:
      - "10909:10909"
      - "10911:10911"
      - "10912:10912"
    environment:
      TZ: "Asia/Shanghai"
      NAMESRV_ADDR: "rmq-nameserver:9876"
      JAVA_OPT_EXT: "-server -Xms256m -Xmx256m -Xmn512m"
    volumes:
      - ./logs:/home/rocketmq/logs
      - ./store:/home/rocketmq/store
      - ./conf/broker.conf:/opt/rocketmq-4.9.8/conf/broker.conf
    command: sh mqbroker -c /opt/rocketmq-4.9.8/conf/broker.conf
    external_links:
      - rmq-nameserver
    networks:
      - rmq-net

# rocketmq network
networks:
  rmq-net:
    external: true
```

启动 RocketMQ Broker 容器。

```shell
docker-compose -f broker.yaml up -d
```

启动成功后，可以通过 `docker ps` 命令查看 RocketMQ Broker 容器是否启动成功。

#### 部署 Dashboard

创建 `dashboard` 目录，并切换到 `dashboard` 目录下。

```shell
mkdir dashboard && cd dashboard
```

在 `dashboard` 目录下创建 `dashboard.yaml` 文件，内容如下：

```shell
services:
  console:
    # image: apache/rocketmq-console-ng:1.0.0
    image: apache/rocketmq-dashboard:1.0.1
    container_name: rmq-dashboard
    restart: unless-stopped
    ports:
      - 8080:8080
    environment:
      TZ: "Asia/Shanghai"
      JAVA_OPTS: "-Drocketmq.config.namesrvAddrs=rmq-nameserver:9876 -Drocketmq.config.isVIPChannel=false"
    external_links:
      - rmq-nameserver
    networks:
      - rmq-net

# 设置使用的网络
networks:
  rmq-net:
    external: true
```

启动 RocketMQ Dashboard 容器。

```shell
docker-compose -f dashboard.yaml up -d
```

启动成功后，可以通过 `docker ps` 命令查看 RocketMQ Dashboard 容器是否启动成功。