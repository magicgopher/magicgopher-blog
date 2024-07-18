# MySQL部署

## 启动单示例MySQL容器

使用 Docker 启动一个 MySQL 容器，这里我使用 MacOS 13.6.7 系统上的 Colima 启动的 Docker 容器启动的「ARM版本」。

```sh
docker run -p 3306:3306 --name mysql8 \
        -e MYSQL_ROOT_PASSWORD=12345678 \
        -d mysql:8.4.1
```

以上使用 docker run 命令启动的 MySQL 容器并没有使用数据卷将数据持久化到主机上，因此当容器被删除时，数据将丢失。

## 启动持久化启动单示例MySQL容器

使用 Docker Volume 持久化 MySQL 容器的数据。

```sh
# 创建一个mysql目录，并切换到该目录
mkdir mysql && cd mysql

# 创建一个mysql_volumes目录，并切换到该目录，该目录是用于存储mysql容器持久化的数据的
mkdir mysql_volumes && cd mysql_volumes

# 在mysql_volumes目录下创建 data 目录【该目录是mysql容器持久化数据的目录】
mkdir data

# 创建完 data 目录之后，目录结构如下：
mysql
    └── mysql_volumes
        ├── data

# 给 data 目录分配权限
chmod -R 777 data

# 需要在mysql这个目录执行启动mysql容器命令
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

```sh
# 在mysql_volumes目录下创建 conf 目录。
# 该目录是用于存储mysql容器配置文件的目录。
# 这里是将MySQL容器内的配置文件映射出来到宿主机上的。
mkdir conf

# 创建完 conf 目录之后，目录结构如下：
mysql
    └── mysql_volumes
        ├── conf
        ├── data
```

具体的 MySQL 数据库 `my.cnf` 配置文件内容如下：

```cnf
###########################################################################
## 客户端参数配置
###########################################################################
[client]
# 默认字符集
default-character-set = utf8mb4

# MySQL 客户端程序连接 MySQL 服务器时使用的 Unix 域套接字文件的路径
socket = /var/run/mysqld/mysqld.sock

[mysql]
#prompt="\u@mysqldb \R:\m:\s [\d]> "
#关闭自动补全sql命令功能
no-auto-rehash

###########################################################################
## 服务端参数配置
###########################################################################
[mysqld]
# MySQL 服务器启动时使用的用户名
user=mysql

# 设置 MySQL 服务器监听的端口号
port = 3306

# 设置 MySQL 服务器在网络上的监听地址，0.0.0.0 是一个特殊的 IP 地址，表示服务器上的所有网络接口
bind-address=0.0.0.0

# 设置 MySQL 服务器存储数据库数据文件的目录路径
datadir = /var/lib/mysql

# 指定 MySQL 服务器监听的 Unix 域套接字文件的路径
socket = /var/run/mysqld/mysqld.sock

# 设置 MySQL 服务器进程的 PID (Process ID) 文件的存储路径
pid-file = /var/run/mysqld/mysqld.pid

# 设置 MySQL 服务器的错误日志文件路径
log-error = /var/log/mysql/error.log

# 设置 MySQL 服务器是否开启主机缓存功能
# 0：关闭主机缓存功能
# 1：开启主机缓存功能
host-cache-size=0

# 设置 MySQL 服务器最大允许的并发连接数量
max_connections = 300

# 设置 MySQL 服务器允许的最大连接错误次数
max_connect_errors = 150

# 设置 MySQL 服务器的默认字符集
character-set-server = utf8mb4

# 设置 MySQL 服务器的默认校对规则
collation-server = utf8mb4_general_ci

# 设置 MySQL 服务器的默认存储引擎
default-storage-engine = INNODB

# 执行 sql 的模式，规定了 sql 的安全等级
sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# 是否对SQL语句大小写敏感
# 0：表名和其他数据库对象名称区分大小写，并且在存储时保持原有大小写。这是 Unix/Linux 系统的默认值。
# 1：表名和其他数据库对象名称不区分大小写，并且存储时转换为小写。这是 Windows 系统的默认值。
# 2：表名和其他数据库对象名称不区分大小写，但 MySQL 会保留原有的大小写形式。
lower_case_table_names = 1

# 设置 MySQL 服务器的事务隔离级别
transaction_isolation = READ-COMMITTED

# 指定时间存储默认时区
default_time_zone = '+08:00'

# 设置client连接mysql时的字符集，防止乱码
init_connect = 'SET NAMES utf8mb4'

# TIMESTAMP如果没有显示声明NOT NULL，允许NULL值
explicit_defaults_for_timestamp = true
```

关于 `my.cnf` 文件的具体配置可以参考 [MySQL官网](https://www.mysql.com/) 的案例。

创建 `my.cnf` 配置文件之后，就需要在 `mysql_volumes` 目录下创建 `log` 目录【该目录用于存储 MySQL 容器的日志文件】、`init` 目录【该目录是用于存储 MySQL 容器的初始化脚本文件】。

```sh
# 在 mysql_volumes 目录下创建 log 目录、init 目录
mkdir log init

# 创建 log 目录、init 目录后的目录结构如下：
mysql
    └── mysql_volumes
        ├── conf
        |       └── my.cnf
        ├── data
        ├── init
        └── log

# 分别给 my.cnf 配置文件、data 目录、log 目录、init 目录分配对应的权限。
chmod -R 777 conf log init
chmod 644 my.cnf
```

然后再修改 `docker run` 启动 MySQL 容器的命令，修改后的命令如下：

```sh
# 这个命令一定是要在 mysql 目录下执行
docker run -p 3306:3306 --name mysql8 \
        -v $(pwd)/mysql_volumes/data:/var/lib/mysql \
        -v $(pwd)/mysql_volumes/conf:/etc/mysql/conf.d \
        -v $(pwd)/mysql_volumes/log:/var/log/mysql \
        -v $(pwd)/mysql_volumes/init:/docker-entrypoint-initdb.d \
        -e MYSQL_ROOT_PASSWORD=12345678 \
        --restart=unless-stopped \
        --privileged=true \
        -d mysql:8.4.1
        # -d arm64v8/mysql:8.4.1
```