---
title: MySQL部署
author: MagicGopher
keywords: docker, mysql
description: 介绍如何使用 Docker 部署 MySQL 数据库，以及搭建 MySQL 主从同步
editLink: false
---

# MySQL部署

## 启动MySQL容器

使用 Docker 启动一个 MySQL 容器，这里我使用 MacOS 13.6.7 系统上的 Colima 启动的 Docker 容器启动的「ARM版本」。

```shell
docker run -p 3306:3306 --name mysql8 \
        -e MYSQL_ROOT_PASSWORD=12345678 \
        -d mysql:8.4.1
```

验证容器是否正常启动。

```shell
# 查看是否有名为 mysql8 的容器
docker ps
```

进入容器内部，使用 `mysql` 自带的客户端连接 MySQL 服务器。

```shell
# docker exec -it 容器ID或者容器名称 bash
docker exec -it mysql8 bash

# 登录成功后，使用 mysql 命令登录 MySQL 服务器(这里是用root用户登录)
mysql -uroot -p12345678
```

以上使用 docker run 命令启动的 MySQL 容器并没有使用数据卷将数据持久化到主机上，因此当容器被删除时，数据将丢失。

## 使用数据卷持久化容器数据

### 创建数据卷需要的目录

使用 Docker Volume 持久化 MySQL 容器的数据，创建一个 `mysql` 目录，并切换到该目录。

```shell
mkdir mysql && cd mysql
```

在 `mysql` 目录下创建一个 `mysql_volumes` 目录，并切换到该目录，该目录是用于存储 mysql 容器持久化的数据的。

```shell
mkdir mysql_volumes && cd mysql_volumes
```

在 `mysql_volumes` 目录下创建 `data` 目录【该目录是 mysql 容器持久化数据的目录】。

```shell
mkdir data
```

创建完 `data` 目录之后，目录结构如下：

```shell
mysql
    └── mysql_volumes
        └── data
```

给 `data` 目录分配权限。

```shell
chmod -R 777 data
```

需要在 `mysql` 这个目录执行启动 MySQL 容器命令。

```shell
docker run -p 3306:3306 --name mysql8 \
        -v $PWD/mysql_volumes/data:/var/lib/mysql \
        -e MYSQL_ROOT_PASSWORD=12345678 \
        -d mysql:8.4.1
```

以上 docker run 命令讲解：
- `-p` 参数用于将主机的端口号 3306 映射到容器的端口号 3306。
- `--name`：容器名称。
- `-v`：参数用于将主机的目录映射到容器的目录，这里是将主机的 `mysql_volumes/data` 目录映射到容器的 `/var/lib/mysql` 目录。
- `-e`：参数用于设置环境变量，这里设置环境变量 `MYSQL_ROOT_PASSWORD` 的值为 `12345678`。
- `-d`：参数用于将 MySQL 容器设置为后台运行模式。
- `mysql:8.4.1`：镜像名称。
- `\`：换行符。

将 MySQL 容器的日志目录、配置文件目录、数据数据初始化目录、插件目录持久化到主机上，因此当容器被删除时，数据不会丢失。

在 mysql_volumes 目录下创建 `conf` 目录，该目录是用于存储 MySQL 容器配置文件的目录将 MySQL 容器内的配置文件映射出来到宿主机上的。
```shell
mkdir conf
```

创建完 `conf` 目录之后，目录结构如下：

```shell
mysql
    └── mysql_volumes
        ├── conf
        └── data
```

### 创建 my.cnf 配置文件

具体的 MySQL 数据库 `my.cnf` 配置文件内容如下：

```shell
###########################################################################
## 客户端参数配置
###########################################################################
[client]
# 默认字符集
default-character-set = utf8mb4

# MySQL 客户端程序连接 MySQL 服务器时使用的 Unix 域套接字文件的路径
socket = /tmp/socket/mysql.sock

[mysql]
# prompt = "\u@mysqldb \R:\m:\s [\d]> "
#关闭自动补全sql命令功能
no-auto-rehash

###########################################################################
## 服务端参数配置
###########################################################################
[mysqld]
# 设置 MySQL 服务器监听的端口号
port = 3306

# 设置 MySQL 服务器在网络上的监听地址，0.0.0.0 是一个特殊的 IP 地址，表示服务器上的所有网络接口
bind-address = 0.0.0.0

# 设置 MySQL 服务器存储数据库数据文件的目录路径
datadir = /var/lib/mysql

# 指定 MySQL 服务器监听的 Unix 域套接字文件的路径
socket = /tmp/socket/mysql.sock

# 设置 MySQL 服务器进程的 PID (Process ID) 文件的存储路径
pid-file = /tmp/pid/mysqld.pid

# 设置 MySQL 服务器的错误日志文件路径
log-error = /var/log/error.log

# 设置 MySQL 服务器是否开启主机缓存功能
# 0：关闭主机缓存功能
# 1：开启主机缓存功能
host-cache-size = 0

# 指定时间存储默认时区
default_time_zone = "+8:00"

# 数据库默认字符集，主流字符集支持一些特殊表情符号（特殊表情符占用4个字节）
character-set-server = utf8mb4

# 数据库字符集对应一些排序等规则，注意要和 character-set-server 对应
collation-server = utf8mb4_general_ci

# 设置 client 连接 mysql 时的字符集，防止乱码
init_connect='SET NAMES utf8mb4'

# 是否对SQL语句大小写敏感
# 0：表名和其他数据库对象名称区分大小写，并且在存储时保持原有大小写。这是 Unix/Linux 系统的默认值。
# 1：表名和其他数据库对象名称不区分大小写，并且存储时转换为小写。这是 Windows 系统的默认值。
# 2：表名和其他数据库对象名称不区分大小写，但 MySQL 会保留原有的大小写形式。
lower_case_table_names = 1

# 执行 sql 的模式，规定了 sql 的安全等级, 暂时屏蔽，my.cnf 文件中配置报错
# sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# 设置 MySQL 服务器的事务隔离级别，默认事务隔离级别为 REPEATABLE-READ
transaction_isolation = READ-COMMITTED

# 设置 MySQL 服务器的默认存储引擎
default-storage-engine = INNODB

# TIMESTAMP 如果没有显示声明 NOT NULL，允许NULL值
explicit_defaults_for_timestamp = true

# 控制 mysqld 进程能使用的最大文件描述(FD)符数量。
# 需要注意的是这个变量的值并不一定是你设定的值，mysqld 会在系统允许的情况下尽量获取更多的 FD 数量
open_files_limit = 65535

# 允许连接的最大客户端数量
max_connections = 500

# 允许连接失败的最大次数
max_connect_errors = 300

# MySQL 暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中
# 官方建议 back_log = 50 + (max_connections / 5), 封顶数为 65535, 默认值 = max_connections
back_log = 110

# 为所有线程打开的表的数量
# 例如，对于200个并发运行的连接，指定表缓存大小至少为 200 * N
# 其中N是您执行的任何查询中每个连接的最大表数
table_open_cache = 600

# 可以存储在定义缓存中的表定义数量, MIN(400 + table_open_cache / 2, 2000)
table_definition_cache = 700

# 为了减少会话之间的争用，可以将 opentables 缓存划分为 table_open_cache/table_open_cache_instances个小缓存
table_open_cache_instances = 64

# 每个线程的堆栈大小 如果线程堆栈太小，则会限制执行复杂 SQL 语句
# 这里设置为512K，即 512 * 1024 = 524288 字节
thread_stack = 512K

# 禁止外部系统锁
external-locking = FALSE

# SQL 数据包发送的大小，如果有 BLOB 对象建议修改成 1G
max_allowed_packet = 128M

# order by / group by 时用到, 建议先调整为4M，后期观察调整
sort_buffer_size = 4M

# inner left / right join 时用到, 建议先调整为4M，后期观察调整
join_buffer_size = 4M

# 如果您的服务器每秒达到数百个连接，则通常应将 thread_cache_size 设置得足够高，以便大多数新连接使用缓存线程
# default value = 8 + ( max_connections / 100) 上限为 100
thread_cache_size = 20

# MySQL 连接闲置超过一定时间后(单位：秒)将会被强行关闭
# MySQL 默认的 wait_timeout 值为8个小时, interactive_timeout 参数需要同时配置才能生效
interactive_timeout = 1800
wait_timeout = 1800

# Metadata Lock最大时长（秒），一般用于控制 alter 操作的最大时长 sine mysql5.6
# 执行 DML 操作时除了增加innodb事务锁外还增加 Metadata Lock，其他 alter（DDL）session 将阻塞
lock_wait_timeout = 3600

# 内部内存临时表的最大值。
# 比如大数据量的 group by / order by 时可能用到临时表，
# 超过了这个值将写入磁盘，系统IO压力增大
tmp_table_size = 64M
max_heap_table_size = 64M

# 有需要加入其他配置，后续加入即可
```

关于 `my.cnf` 文件的具体配置可以参考 [MySQL官网](https://www.mysql.com/) 的案例。

### 创建目录和赋予权限

创建 `my.cnf` 配置文件之后，就需要在 `mysql_volumes` 目录下创建 `log` 目录【该目录用于存储 MySQL 容器的日志文件】、`init` 目录【该目录是用于存储 MySQL 容器的初始化脚本文件】。

在 `mysql_volumes` 目录下创建 `log` 目录、`init` 目录。

```shell
mkdir log init
```

创建 `log` 目录、`init` 目录后的目录结构如下：

```shell
mysql
    └── mysql_volumes
        ├── conf
        │   └── my.cnf
        ├── data
        ├── init
        └── log
```

切换到 my.cnf 配置文件所在的路径【所在的目录】，给 my.cnf 配置文件添加权限。

```shell
chmod 644 my.cnf
```

切换到 `data` 目录、`log` 目录、`init` 目录所在的路径【所在的目录】，给 `data` 目录、`log` 目录、`init` 目录分配对应的权限。

```shell
chmod -R 777 data log init
```

### 启动容器命令

然后再修改 `docker run` 启动 MySQL 容器的命令，修改后的命令如下：

```shell
# 这个命令一定是要在 mysql 目录下执行
docker run -p 3306:3306 --name mysql8 \
        -v $(pwd)/mysql_volumes/data:/var/lib/mysql \
        -v $(pwd)/mysql_volumes/conf:/etc/mysql/conf.d \
        -v $(pwd)/mysql_volumes/log:/var/log \
        -v $(pwd)/mysql_volumes/init:/docker-entrypoint-initdb.d \
        -e MYSQL_ROOT_PASSWORD=12345678 \
        --restart=unless-stopped \
        -d mysql:8.4.1
        # -d arm64v8/mysql:8.4.1
```

## Docker Compose 部署 MySQL

### 目录结构说明

文件目录结构如下：

```shell
mysql
    ├── mysql.yaml
    └── mysql_volumes
        ├── conf
        │   └── my.cnf
        ├── data
        ├── init
        └── log
```

目录结构详细说明：
- `mysql.yaml`：Docker Compose 配置文件，用于启动 MySQL 容器。
- `mysql_volumes`：MySQL 数据卷目录，用于存储 MySQL 容器映射数据。
- `conf`：MySQL 配置文件目录，用于存储 MySQL 配置文件。
- `data`：MySQL 数据目录，用于存储 MySQL 数据。
- `init`：MySQL 初始化脚本目录，用于存储 MySQL 初始化脚本。
- `log`：MySQL 日志目录，用于存储 MySQL 日志。

### 创建目录和赋予权限

```shell
# 创建mysql_volumes并切换到mysql_volumes目录下
mkdir mysql_volumes && cd mysql_volumes

# 在 mysql_volumes 目录下创建 conf 目录、data 目录、log 目录、init 目录
mkdir conf data log init

# 在 conf 目录下创建 my.cnf 配置文件，然后再使用 vim 来编辑 my.cnf 配置文件
cd conf && touch my.cnf
```

以下是 `my.cnf` 配置文件内容：

[请参考上面👆的my.cnf配置文件](#创建-my-cnf-配置文件)

然后给 my.cnf 配置文件添加权限。

```shell
chmod 644 my.cnf
```

再给 `mysql_volumes` 目录下的 `data`、`log`、`init` 目录添加权限。
```shell
chmod -R 777 data log init
```

### 启动容器

创建并编辑 `mysql.yaml` 配置文件，内容如下：

```yaml
services:
  mysql:
    image: mysql:8.4.1
    container_name: mysql8
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 12345678
      TZ: Asia/Shanghai
    ports:
      - 13306:3306
    volumes:
      - ./mysql_volumes/data:/var/lib/mysql
      - ./mysql_volumes/conf:/etc/mysql/conf.d
      - ./mysql_volumes/log:/var/log
      - ./mysql_volumes/init:/docker-entrypoint-initdb.d

# container network
networks:
  default:
    name: mysql-net
    driver: bridge
```

切换到 `mysql` 目录下，然后执行以下命令启动 MySQL 容器。

```shell
docker-compose -f mysql.yaml up -d
```

## Docker Compose 部署 MySQL 主从

> 使用 Docker Compose 部署 MySQL 主从并不是真正的分布式多节点，这里还是在一台机器上启动的容器实例，只能说这是在一台机器上开启容器实例，这台机器要是挂了，这台机器上部署的MySQL主从也就挂了。

### 主从复制概述

主从复制是指将主数据库的 DDL和 DML 操作通过二进制日志传到从库服务器中，然后在从库上对这些日志重新执行（也叫重做），从而使得从库和主库的数据保持同步。

MySQL 支持一台主库同时向多台从库进行复制，从库同时也可以作为其他从服务器的主库，实现链状复制。

![image-01](https://mirror.ghproxy.com/https://github.com/MagicGopher/image-repo/blob/main/MagicGopher-Blog/DevOps/01-Docker/02-Docker%E5%BA%94%E7%94%A8%E5%AE%9E%E6%88%98/assets/image-01.png?raw=true)

MySQL 主从复制的有点主要包含以下三个方面：
- 主库出现问题，可以快速切换到从库提供服务。
- 实现读写分离，降低主库的访问压力。
- 可以在从库中执行备份，以避免备份期间影响主库服务。

### 主从复制原理

简单了解一下MySQL数据库的主从复制原理：

![image-02](https://mirror.ghproxy.com/https://github.com/MagicGopher/image-repo/blob/main/MagicGopher-Blog/DevOps/01-Docker/02-Docker%E5%BA%94%E7%94%A8%E5%AE%9E%E6%88%98/assets/image-02.png?raw=true)

1. 主库 `master` 服务器会将 SQL 记录通过 `dump` 线程写入到二进制日志 `binary log` 中。
2. 从库 `slave` 服务器开启一个 `io thread` 线程向服务器发送请求，向主库 `master` 请求 `binary log`。主库 `master` 服务器在接收到请求之后，根据偏移量将新的 `binary log` 发送给 `slave` 服务器。
3. 从库 `slave` 服务器收到新的 `binary log` 之后，写入到自身的 `relay log` 中，这就是所谓的中继日志。
4. 从库 `slave` 服务器，单独开启一个 `sql thread` 读取 `relay log` 之后，写入到自身数据中，从而保证主从的数据一致。

### 部署主从

#### 目录结构说明

使用 Docker Compose 部署 MySQL 主从，目录结构如下：

```shell
mysql-cluster
    ├── mysql-master
    │   ├── conf
    │   │   └── my.cnf
    │   ├── data
    │   ├── init
    │   │   └── sync_master.sh
    │   ├── log
    │   └── mysql-master.yaml
    ├── mysql-slave-01
    │   ├── conf
    │   │   └── my.cnf
    │   ├── data
    │   ├── init
    │   │   └── sync_slave.sh
    │   ├── log
    │   └── mysql-slave-01.yaml
    └── mysql-slave-02
        ├── conf
        │   └── my.cnf
        ├── data
        ├── init
        │   └── sync_slave.sh
        ├── log
        └── mysql-slave-02.yaml
```

创建 `mysql-cluster` 目录以及 `mysql-cluster` 目录内的 `mysql-master` 目录和 `mysql-slave-01`、`mysql-slave-02` 目录。

```shell
mkdir mysql-cluster && cd mysql-cluster

mkdir mysql-master && mkdir mysql-slave-01 && mkdir mysql-slave-02
```

#### mysql master 配置

首先是在 `mysql-master` 目录下创建 `conf`、`data`、`init`、`log` 目录。

```shell
mkdir conf data init log
```

然后在 conf 目录下创建 `my.cnf` 配置文件，然后再使用 vim 来编辑 `my.cnf` 配置文件，具体内容如下：

```shell
###########################################################################
## 客户端参数配置
###########################################################################
[client]
# 默认字符集
default-character-set = utf8mb4

# MySQL 客户端程序连接 MySQL 服务器时使用的 Unix 域套接字文件的路径
socket = /tmp/socket/mysql.sock

[mysql]
# prompt = "\u@mysqldb \R:\m:\s [\d]> "
#关闭自动补全sql命令功能
no-auto-rehash

###########################################################################
## 服务端参数配置
###########################################################################
[mysqld]
# 设置 MySQL 服务器监听的端口号
port = 3306

# 设置 MySQL 服务器在网络上的监听地址，0.0.0.0 是一个特殊的 IP 地址，表示服务器上的所有网络接口
bind-address = 0.0.0.0

# 设置 MySQL 服务器存储数据库数据文件的目录路径
datadir = /var/lib/mysql

# 指定 MySQL 服务器监听的 Unix 域套接字文件的路径
socket = /tmp/socket/mysql.sock

# 设置 MySQL 服务器进程的 PID (Process ID) 文件的存储路径
pid-file = /tmp/pid/mysqld.pid

# 设置 MySQL 服务器的错误日志文件路径
log-error = /var/log/error.log

# 设置 MySQL 服务器是否开启主机缓存功能
# 0：关闭主机缓存功能
# 1：开启主机缓存功能
host-cache-size = 0

# 指定时间存储默认时区
default_time_zone = "+8:00"

# 数据库默认字符集，主流字符集支持一些特殊表情符号（特殊表情符占用4个字节）
character-set-server = utf8mb4

# 数据库字符集对应一些排序等规则，注意要和 character-set-server 对应
collation-server = utf8mb4_general_ci

# 设置 client 连接 mysql 时的字符集，防止乱码
init_connect='SET NAMES utf8mb4'

# 是否对SQL语句大小写敏感
# 0：表名和其他数据库对象名称区分大小写，并且在存储时保持原有大小写。这是 Unix/Linux 系统的默认值。
# 1：表名和其他数据库对象名称不区分大小写，并且存储时转换为小写。这是 Windows 系统的默认值。
# 2：表名和其他数据库对象名称不区分大小写，但 MySQL 会保留原有的大小写形式。
lower_case_table_names = 1

# 执行 sql 的模式，规定了 sql 的安全等级, 暂时屏蔽，my.cnf 文件中配置报错
# sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# 设置 MySQL 服务器的事务隔离级别，默认事务隔离级别为 REPEATABLE-READ
transaction_isolation = READ-COMMITTED

# 设置 MySQL 服务器的默认存储引擎
default-storage-engine = INNODB

# TIMESTAMP 如果没有显示声明 NOT NULL，允许NULL值
explicit_defaults_for_timestamp = true

# 控制 mysqld 进程能使用的最大文件描述(FD)符数量。
# 需要注意的是这个变量的值并不一定是你设定的值，mysqld 会在系统允许的情况下尽量获取更多的 FD 数量
open_files_limit = 65535

# 允许连接的最大客户端数量
max_connections = 500

# 允许连接失败的最大次数
max_connect_errors = 300

# MySQL 暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中
# 官方建议 back_log = 50 + (max_connections / 5), 封顶数为 65535, 默认值 = max_connections
back_log = 110

# 为所有线程打开的表的数量
# 例如，对于200个并发运行的连接，指定表缓存大小至少为 200 * N
# 其中N是您执行的任何查询中每个连接的最大表数
table_open_cache = 600

# 可以存储在定义缓存中的表定义数量, MIN(400 + table_open_cache / 2, 2000)
table_definition_cache = 700

# 为了减少会话之间的争用，可以将 opentables 缓存划分为 table_open_cache/table_open_cache_instances个小缓存
table_open_cache_instances = 64

# 每个线程的堆栈大小 如果线程堆栈太小，则会限制执行复杂 SQL 语句
# 这里设置为512K，即 512 * 1024 = 524288 字节
thread_stack = 512K

# 禁止外部系统锁
external-locking = FALSE

# SQL 数据包发送的大小，如果有 BLOB 对象建议修改成 1G
max_allowed_packet = 128M

# order by / group by 时用到, 建议先调整为4M，后期观察调整
sort_buffer_size = 4M

# inner left / right join 时用到, 建议先调整为4M，后期观察调整
join_buffer_size = 4M

# 如果您的服务器每秒达到数百个连接，则通常应将 thread_cache_size 设置得足够高，以便大多数新连接使用缓存线程
# default value = 8 + ( max_connections / 100) 上限为 100
thread_cache_size = 20

# MySQL 连接闲置超过一定时间后(单位：秒)将会被强行关闭
# MySQL 默认的 wait_timeout 值为8个小时, interactive_timeout 参数需要同时配置才能生效
interactive_timeout = 1800
wait_timeout = 1800

# Metadata Lock最大时长（秒），一般用于控制 alter 操作的最大时长 sine mysql5.6
# 执行 DML 操作时除了增加innodb事务锁外还增加 Metadata Lock，其他 alter（DDL）session 将阻塞
lock_wait_timeout = 3600

# 内部内存临时表的最大值。
# 比如大数据量的 group by / order by 时可能用到临时表，
# 超过了这个值将写入磁盘，系统IO压力增大
tmp_table_size = 64M
max_heap_table_size = 64M

###########################################################################
## BinLog 设置
###########################################################################
# server-id 用于标识数据库实例，要保证同一个网段内的数值不能重复
server-id = 1

# 开启 bin log 功能
log-bin = mysql-bin

# 忽略的数据, 指不需要同步的数据库
binlog-ignore-db=mysql

###########################################################################
## RedoLog 日志和 BinLog 日志的写磁盘频率设置
###########################################################################
# 默认 sync_binlog = 0，表示 MySQL 不控制 binlog 的刷新，sync_binlog > 0，表示每 sync_binlog 次事务提交
sync_binlog = 1

###########################################################################
## master 配置
###########################################################################
# 默认 read_only = 0，表示 MySQL 可以读写，read_only = 1，表示 MySQL 只读
read_only = 0
```

给 `my.cnf` 文件添加权限。

```shell
chmod 644 my.cnf
```

然后在 `init` 目录下创建 `sync_master.sh` 脚本，然后再使用 vim 来编辑 `sync_master.sh` 脚本，内容如下：

```shell
# 定义连接master进行同步的账号
MASTER_SYNC_USER=sync_admin
# 定义连接master进行同步的账号使用的密码
MASTER_SYNC_PASSWORD=sync12345678
# 定义用于登录MySQL的用户名
ADMIN_USER=root
# 定义用于登录MySQL的用户名使用的密码
ADMIN_PASSWORD=12345678
# 定义运行登录的Host地址
ALLOW_HOST=%
# 定义创建账号的SQL语句（这里创建操作数据库同步使用的用户）
CREATE_USER_SQL="CREATE USER '$MASTER_SYNC_USER'@'$ALLOW_HOST' IDENTIFIED BY '$MASTER_SYNC_PASSWORD';"
# 定义赋予同步账号权限的SQL，这里设置两个权限 REPLICATION 
GRANT_PRIVILEGES_SQL="GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO '$MASTER_SYNC_USER'@'$ALLOW_HOST';"
# 定义刷新权限
FLUSH_PRIVILEGES_SQL="FLUSH PRIVILEGES;"
# 执行SQL语句
mysql -u"$ADMIN_USER" -p"$ADMIN_PASSWORD" -e "$CREATE_USER_SQL $GRANT_PRIVILEGES_SQL $FLUSH_PRIVILEGES_SQL"
```

给 `sync_master.sh` 脚本添加权限。

```shell
chmod 755 sync_master.sh
```

给 mysql-master 目录下的 `data`、`log` 目录添加权限。

```shell
chmod -R 777 data log
```

编写 `mysql-master.yaml` 文件，内容如下：

```yaml
services:
  mysql-master:
    image: mysql:8.4.1
    container_name: mysql-master
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 12345678
      TZ: Asia/Shanghai
    ports:
      - 23306:3306
    volumes:
      - ./data:/var/lib/mysql
      - ./conf:/etc/mysql/conf.d
      - ./log:/var/log
      - ./init:/docker-entrypoint-initdb.d
    networks:
      default:
        # 设置容器内使用的IP地址
        ipv4_address: 192.168.10.10

# 容器使用的网络
networks:
  default:
    # 网络名称
    name: mysql-cluster-net
    # 网络驱动 bridge"是Docker的默认网络驱动程序
    driver: bridge
    ipam:
      config:
        # subnet 指定一个子网，将使用这个子网提供IP地址给容器
        - subnet: "192.168.10.0/24"
```

启动 mysql-master 容器，在 `mysql-master` 目录下执行。

```shell
docker-compose -f mysql-master.yaml up -d
```

然后使用客户端工具连接上mysql-master，或者是进入容器内部使用mysql client连接上mysql，查看master的状态和查看是否创建成功同步账号，这里我使用进入容器内部的方式。

```shell
docker exec -it mysql-master bash
```

使用客户端工具连接上mysql-master，执行如下命令：

```shell
mysql -uroot -p12345678
```

查看mysql master的状态。

```shell
SHOW BINARY LOG STATUS;

# 输出如下，这里文件名是mysql-bin.000003，位置是158
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000003 |      158 |              | mysql            |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.01 sec)
```

查看是否有创建操作主从同步的用户sync_admin。

```shell
select Host,User from mysql.user;

# 输出如下
+-----------+------------------+
| Host      | User             |
+-----------+------------------+
| %         | root             |
| %         | sync_admin       |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
6 rows in set (0.00 sec)
```

#### mysql slave 配置

首先是在 `mysql-slave-01` 或 `mysql-slave-02` 目录下创建 `conf`、`data`、`init`、`log` 目录。

```shell
mkdir conf data init log
```

然后在 conf 目录下创建 `my.cnf` 配置文件，然后再使用 vim 来编辑 `my.cnf` 配置文件，slave 的 `my.cnf` 需要注意的是 `server-id` 不能和 master 的 `server-id` 相同，这里我定义为 2 和 3，还有 `read_only` 参数设置为 1，表示 MySQL 只读，具体内容如下：

```shell
###########################################################################
## 客户端参数配置
###########################################################################
[client]
# 默认字符集
default-character-set = utf8mb4

# MySQL 客户端程序连接 MySQL 服务器时使用的 Unix 域套接字文件的路径
socket = /tmp/socket/mysql.sock

[mysql]
# prompt = "\u@mysqldb \R:\m:\s [\d]> "
#关闭自动补全sql命令功能
no-auto-rehash

###########################################################################
## 服务端参数配置
###########################################################################
[mysqld]
# 设置 MySQL 服务器监听的端口号
port = 3306

# 设置 MySQL 服务器在网络上的监听地址，0.0.0.0 是一个特殊的 IP 地址，表示服务器上的所有网络接口
bind-address = 0.0.0.0

# 设置 MySQL 服务器存储数据库数据文件的目录路径
datadir = /var/lib/mysql

# 指定 MySQL 服务器监听的 Unix 域套接字文件的路径
socket = /tmp/socket/mysql.sock

# 设置 MySQL 服务器进程的 PID (Process ID) 文件的存储路径
pid-file = /tmp/pid/mysqld.pid

# 设置 MySQL 服务器的错误日志文件路径
log-error = /var/log/error.log

# 设置 MySQL 服务器是否开启主机缓存功能
# 0：关闭主机缓存功能
# 1：开启主机缓存功能
host-cache-size = 0

# 指定时间存储默认时区
default_time_zone = "+8:00"

# 数据库默认字符集，主流字符集支持一些特殊表情符号（特殊表情符占用4个字节）
character-set-server = utf8mb4

# 数据库字符集对应一些排序等规则，注意要和 character-set-server 对应
collation-server = utf8mb4_general_ci

# 设置 client 连接 mysql 时的字符集，防止乱码
init_connect='SET NAMES utf8mb4'

# 是否对SQL语句大小写敏感
# 0：表名和其他数据库对象名称区分大小写，并且在存储时保持原有大小写。这是 Unix/Linux 系统的默认值。
# 1：表名和其他数据库对象名称不区分大小写，并且存储时转换为小写。这是 Windows 系统的默认值。
# 2：表名和其他数据库对象名称不区分大小写，但 MySQL 会保留原有的大小写形式。
lower_case_table_names = 1

# 执行 sql 的模式，规定了 sql 的安全等级, 暂时屏蔽，my.cnf 文件中配置报错
# sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# 设置 MySQL 服务器的事务隔离级别，默认事务隔离级别为 REPEATABLE-READ
transaction_isolation = READ-COMMITTED

# 设置 MySQL 服务器的默认存储引擎
default-storage-engine = INNODB

# TIMESTAMP 如果没有显示声明 NOT NULL，允许NULL值
explicit_defaults_for_timestamp = true

# 控制 mysqld 进程能使用的最大文件描述(FD)符数量。
# 需要注意的是这个变量的值并不一定是你设定的值，mysqld 会在系统允许的情况下尽量获取更多的 FD 数量
open_files_limit = 65535

# 允许连接的最大客户端数量
max_connections = 500

# 允许连接失败的最大次数
max_connect_errors = 300

# MySQL 暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中
# 官方建议 back_log = 50 + (max_connections / 5), 封顶数为 65535, 默认值 = max_connections
back_log = 110

# 为所有线程打开的表的数量
# 例如，对于200个并发运行的连接，指定表缓存大小至少为 200 * N
# 其中N是您执行的任何查询中每个连接的最大表数
table_open_cache = 600

# 可以存储在定义缓存中的表定义数量, MIN(400 + table_open_cache / 2, 2000)
table_definition_cache = 700

# 为了减少会话之间的争用，可以将 opentables 缓存划分为 table_open_cache/table_open_cache_instances个小缓存
table_open_cache_instances = 64

# 每个线程的堆栈大小 如果线程堆栈太小，则会限制执行复杂 SQL 语句
# 这里设置为512K，即 512 * 1024 = 524288 字节
thread_stack = 512K

# 禁止外部系统锁
external-locking = FALSE

# SQL 数据包发送的大小，如果有 BLOB 对象建议修改成 1G
max_allowed_packet = 128M

# order by / group by 时用到, 建议先调整为4M，后期观察调整
sort_buffer_size = 4M

# inner left / right join 时用到, 建议先调整为4M，后期观察调整
join_buffer_size = 4M

# 如果您的服务器每秒达到数百个连接，则通常应将 thread_cache_size 设置得足够高，以便大多数新连接使用缓存线程
# default value = 8 + ( max_connections / 100) 上限为 100
thread_cache_size = 20

# MySQL 连接闲置超过一定时间后(单位：秒)将会被强行关闭
# MySQL 默认的 wait_timeout 值为8个小时, interactive_timeout 参数需要同时配置才能生效
interactive_timeout = 1800
wait_timeout = 1800

# Metadata Lock最大时长（秒），一般用于控制 alter 操作的最大时长 sine mysql5.6
# 执行 DML 操作时除了增加innodb事务锁外还增加 Metadata Lock，其他 alter（DDL）session 将阻塞
lock_wait_timeout = 3600

# 内部内存临时表的最大值。
# 比如大数据量的 group by / order by 时可能用到临时表，
# 超过了这个值将写入磁盘，系统IO压力增大
tmp_table_size = 64M
max_heap_table_size = 64M

###########################################################################
## BinLog 设置
###########################################################################
# server-id 用于标识数据库实例，要保证同一个网段内的数值不能重复
server-id = 2

# 开启 bin log 功能
log-bin = mysql-bin

# 忽略的数据, 指不需要同步的数据库
binlog-ignore-db=mysql

###########################################################################
## RedoLog 日志和 BinLog 日志的写磁盘频率设置
###########################################################################
# 默认 sync_binlog = 0，表示 MySQL 不控制 binlog 的刷新，sync_binlog > 0，表示每 sync_binlog 次事务提交
sync_binlog = 1

###########################################################################
## master 配置
###########################################################################
# 默认 read_only = 0，表示 MySQL 可以读写，read_only = 1，表示 MySQL 只读
read_only = 1
```

给 `my.cnf` 文件添加权限。

```shell
chmod 644 my.cnf
```

然后在 init 目录下创建 `sync_slave.sh` 脚本，然后再使用 vim 来编辑 `sync_slave.sh` 脚本，内容如下：

```shell
# 定义连接master进行同步的账号
SLAVE_SYNC_USER=sync_admin
# 定义连接master进行同步的账号密码
SLAVE_SYNC_PASSWORD=sync12345678
# 定义slave-1数据库使用的账号
ADMIN_USER=root
# 定义slave-1数据库使用的账号使用的密码
ADMIN_PASSWORD=12345678
# 定义连接master的host地址
SOURCE_HOST=192.168.10.10
# 等待10s，保证master数据库启动成功，不然会连接失败
sleep 10
# 连接master数据库，查询二进制数据，并解析出logfile和pos，这里同步用户要开启 REPLICATION CLIENT权限，才能使用SHOW BINARY LOG STATUS;
RESULT=`mysql -u"$SLAVE_SYNC_USER" -h$SOURCE_HOST -p"$SLAVE_SYNC_PASSWORD" -e "SHOW BINARY LOG STATUS;" | grep -v grep |tail -n +2| awk '{print $1,$2}'`
# 解析出logfile
SOURCE_LOG_FILE=`echo $RESULT | grep -v grep | awk '{print $1}'`
# 解析出pos
SOURCE_LOG_POS=`echo $RESULT | grep -v grep | awk '{print $2}'`
# 设置连接master的同步相关信息
SYNC_SQL="CHANGE REPLICATION SOURCE TO SOURCE_HOST='$SOURCE_HOST',SOURCE_USER='$SLAVE_SYNC_USER',SOURCE_PASSWORD='$SLAVE_SYNC_PASSWORD',SOURCE_LOG_FILE='$SOURCE_LOG_FILE',SOURCE_LOG_POS=$SOURCE_LOG_POS;"
# 开启同步
START_SYNC_SQL="START REPLICA;"
# 查看同步状态
STATUS_SQL="SHOW REPLICA STATUS\G;"
mysql -u"$ADMIN_USER" -p"$ADMIN_PASSWORD" -e "$SYNC_SQL $START_SYNC_SQL $STATUS_SQL"
```

给 `sync_slave.sh` 脚本添加权限。

```shell
chmod 755 sync_slave.sh
```

给 mysql-slave-01 和 mysql-slave-02 目录下的 `data`、`log` 目录添加权限。

```shell
chmod -R 777 data log
```

然后编写 slave 的yaml配置文件，分别是：`mysql-slave-01.yaml`、`mysql-slave-02.yaml` 内容如下：

::: code-group
```yaml [mysql-slave-01.yaml]
services:
  mysql-slave-01:
    image: mysql:8.4.1
    container_name: mysql-slave-01
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 12345678
      TZ: Asia/Shanghai
    ports:
      - 23316:3306
    volumes:
      - ./data:/var/lib/mysql
      - ./conf:/etc/mysql/conf.d
      - ./log:/var/log
      - ./init:/docker-entrypoint-initdb.d
    networks:
      mysql-cluster-net:
        # 配置容器使用的IP地址
        ipv4_address: 192.168.10.20
    # 建立容器于外部网络的连接
    external_links:
      - mysql-cluster-net

# 容器使用的网络
networks:
  # 所连接网络的名称
  mysql-cluster-net:
    # external: true表示这个网络是一个外部网络，即它并非由当前的Docker Compose项目创建，而是在项目外部已经存在的网络
    external: true
```

```yaml [mysql-slave-02.yaml]
services:
  mysql-slave-02:
    image: mysql:8.4.1
    container_name: mysql-slave-02
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 12345678
      TZ: Asia/Shanghai
    ports:
      - 23317:3306
    volumes:
      - ./data:/var/lib/mysql
      - ./conf:/etc/mysql/conf.d
      - ./log:/var/log
      - ./init:/docker-entrypoint-initdb.d
    networks:
      mysql-cluster-net:
        # 配置容器使用的IP地址
        ipv4_address: 192.168.10.21
    # 建立容器于外部网络的连接
    external_links:
      - mysql-cluster-net

# 容器使用的网络
networks:
  # 所连接网络的名称
  mysql-cluster-net:
    # external: true表示这个网络是一个外部网络，即它并非由当前的Docker Compose项目创建，而是在项目外部已经存在的网络
    external: true
```
:::

启动 mysql-slave-0X 容器【X：表示1、2】，需要在 `mysql-slave-01.yaml` 和 `mysql-slave-02.yaml` 文件所在的目录下（路径下）执行启动容器命令。

::: code-group
```shell [启动mysql-slave-01容器]
docker-compose -f mysql-slave-01.yaml up -d
```

```shell [启动mysql-slave-02容器]
docker-compose -f mysql-slave-02.yaml up -d
```
:::

然后使用客户端工具连接上mysql-slave-01，或者是进入容器内部使用mysql client连接上mysql，查看mysql-slave-01的状态，这里我使用进入容器内部的方式。

::: code-group
```shell [进入mysql-slave-01容器内部]
docker exec -it mysql-slave-01 bash
```

```shell [进入mysql-slave-02容器内部]
docker exec -it mysql-slave-02 bash
```
:::

使用客户端工具连接上mysql-slave-01，执行如下命令：

```shell
mysql -uroot -p12345678
```

查看 mysql-slave-01 的同步状态。

```shell
SHOW REPLICA STATUS\G;

# Replica_IO_Running 和 Replica_SQL_Running 状态为Yes，表示同步正常
# 输出结果如下：
*************************** 1. row ***************************
             Replica_IO_State: Waiting for source to send event
                  Source_Host: 192.168.10.10
                  Source_User: sync_admin
                  Source_Port: 3306
                Connect_Retry: 60
              Source_Log_File: mysql-bin.000003
          Read_Source_Log_Pos: 1123
               Relay_Log_File: 557cb6a17e08-relay-bin.000004
                Relay_Log_Pos: 1293
        Relay_Source_Log_File: mysql-bin.000003
           Replica_IO_Running: Yes
          Replica_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Source_Log_Pos: 1123
              Relay_Log_Space: 1739
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Source_SSL_Allowed: No
           Source_SSL_CA_File:
           Source_SSL_CA_Path:
              Source_SSL_Cert:
            Source_SSL_Cipher:
               Source_SSL_Key:
        Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Source_Server_Id: 1
                  Source_UUID: 68a9194b-4fee-11ef-9951-0242c0a80a0a
             Source_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
    Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Source_Retry_Count: 10
                  Source_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Source_SSL_Crl:
           Source_SSL_Crlpath:
           Retrieved_Gtid_Set:
            Executed_Gtid_Set:
                Auto_Position: 0
         Replicate_Rewrite_DB:
                 Channel_Name:
           Source_TLS_Version:
       Source_public_key_path:
        Get_Source_public_key: 0
            Network_Namespace:
1 row in set (0.00 sec)
```

#### 测试MySQL容器主从

使用图形化客户端工具（DataGrip 或者 Navicat）连接上mysql-master，创建一个数据库，创建一个表，插入一条数据。

```sql
# 创建名为test_db的数据库,设置字符集为utf8mb4 字符排序
CREATE DATABASE test_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# 切换到test_db数据库
USE test_db;

# 创建名为tb_user的表,包含id和name两个字段
# id字段是主键,自动递增
# name字段是varchar类型,不为空
# 表名为'用户表'
CREATE TABLE tb_user(
    id BIGINT AUTO_INCREMENT NOT NULL COMMENT '主键',
    name VARCHAR(30) NOT NULL COMMENT '名称',
    PRIMARY KEY (id)
) COMMENT '用户表';

# 向tb_user表插入两条数据,id字段使用默认值
INSERT INTO tb_user(id, name) VALUES (DEFAULT, '张三'), (DEFAULT, '李四');
```

然后再使用图形化客户端工具（DataGrip 或者 Navicat）连接上mysql-slave-01【mysql-slave-02】，查看数据是否同步到mysql-slave-01【mysql-slave-02】。