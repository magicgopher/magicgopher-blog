# Docker容器操作

## 查看正在运行的容器

```sh
doecker ps

# 输出如下
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

输出内容详细说明：
- `CONTAINER ID`：容器ID
- `IMAGE`：镜像名称
- `COMMAND`：容器启动时执行的命令
- `CREATED`：容器创建时间
- `STATUS`：容器状态
- `PORTS`：容器映射的端口
- `NAMES`：容器名称

## 查看所有容器

```sh
# 使用 -a参数就会显示所有容器（所有状态的容器都显示）
docker ps -a

# 输出如下
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                     PORTS     NAMES
b49bc9e6ee18   mysql:8.4.1   "docker-entrypoint.s…"   17 seconds ago   Exited (0) 6 seconds ago             mysql8
```

## docker ps 命令详细说明

*语法格式*：

```sh
docker ps [OPTIONS]

# OPTIONS说明
# --all【简写：-a】：列出所有容器，包括正在停止的容器。
# --filter filter【简写：-f】：根据提供的条件过滤输出。
# --format string：使用自定义模板格式化输出。
# --last int【简写：-n】：显示最后创建的 n 个容器。
# --latest【简写：-l】：只显示最近创建的容器。
# --no-trunc：不截断输出。
# --quiet【简写：-q】：只显示容器 ID。
# --size【简写：-s】：显示容器的虚拟大小。
```

## 创建并启动容器

使用 docker run 命令创建并启动容器。

*语法格式*：

```sh
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

# OPTIONS说明
# --add-host list             添加自定义主机到IP的映射(host:ip)
# --attach=[]                 附加到STDIN、STDOUT或STDERR
# --blkio-weight uint16       块IO权重(相对权重)
# --blkio-weight-device list  块IO权重(相对设备)
# --cap-add=[]                添加Linux功能
# --cap-drop=[]               删除Linux功能
# --cgroup-parent string      可选的父cgroup
# --cidfile string            将容器ID写入文件
# --cpu-count int             CPU数量
# --cpu-percent int           CPU使用百分比
# --cpu-period int            限制CPU CFS(Completely Fair Scheduler)周期
# --cpu-quota int             限制CPU CFS配额
# --cpu-rt-period int         限制实时CPU微秒
# --cpu-rt-runtime int        最大实时CPU执行时间
# --cpu-shares int            CPU共享权重
# --cpuset-cpus string        允许使用的CPU集合，0-3、0,1
# --cpuset-mems string        允许使用的NUMA内存节点
# --detach【简写：-d】         在后台运行容器并打印容器ID
# --detach-keys string        覆盖分离容器的键序列
# --device list              添加主机设备到容器
# --device-cgroup-rule list  添加设备cgroup规则
# --device-read-bps list      限制设备的读取速率(bps)
# --device-read-iops list     限制设备的读取速率(iops)
# --device-write-bps list     限制设备的写入速率(bps)
# --device-write-iops list    限制设备的写入速率(iops)
# --disable-content-trust    跳过镜像验证
# --dns=[]                     设置自定义DNS服务器
# --dns-option=[]              设置DNS选项
# --dns-search=[]              设置DNS搜索域
# --domainname string         容器的NIS域名
# --entrypoint string         覆盖镜像的入口点
# --env【简写：-e】              设置环境变量
# --env-file=[]                读取环境变量文件
# --expose=[]                  暴露端口或一系列端口
# --group-add=[]               添加加入其他用户组
# --health-cmd string         容器启动后执行的健康检查命令
# --health-interval duration  两次健康检查之间的间隔
# --health-retries int        连续失败多少次后视为不健康
# --health-start-period duration 初始化健康检查所需时间
# --health-timeout duration    健康检查命令可以运行的最大时间
# --help                       打印使用帮助
# --host-alias string         设置容器的主机名
# --hostname string           设置容器的主机名
# --init                       使用一个子进程初始化
# --interactive【简写：-i】     保持STDIN打开，即使没有附加
# --ip string                 IPv4地址(例如: 172.30.100.104)
# --ip6 string                IPv6地址(例如: 2001:db8::33)
# --ipc string                  IPC模式
# --isolation string           容器的隔离技术
# --kernel-memory bytes        kernel内存限制
# --label=[]                   设置容器元数据
# --label-file=[]              读取标签文件
# --link=[]                     链接到另一个容器
# --link-local-ip=[]           容器的链接本地IPv4/IPv6地址
# --log-driver string          容器日志记录驱动
# --log-opt=[]                  日志驱动的可选参数
# --mac-address string         容器MAC地址(例如: 92:d0:c6:0a:29:33)
# --memory【简写：-m】 bytes     内存限制
# --memory-reservation bytes   内存软限制
# --memory-swap bytes          交换限制 = 内存 + 交换
# --memory-swappiness int      容器运行时内存交换优先级(0 - 100)
# --mount mount                挂载一个文件系统
# --name string                容器名称
# --network string             连接容器到网络
# --network-alias=[]           为容器添加网络别名
# --no-healthcheck            禁用容器的任何预定义的健康检查
# --oom-kill-disable          禁用OOM杀手
# --oom-score-adj int          调整容器的OOM调整得分(-1000到1000)
# --pid string                 PID命名空间模式
# --pids-limit int             TID限制
# --privileged                 运行特权容器
# --publish【简写：-p】 list      发布容器端口到主机
# --publish-all【简写：-P】       发布所有暴露的端口
# --read-only                  将容器的根文件系统挂载为只读
# --restart string             容器退出时的重启策略(no,on-failure[:max-retry],always,unless-stopped)
# --rm                         容器退出后自动删除
# --runtime string             容器的运行时，例如runc或kata
# --security-opt=[]             设置安全相关的选项
# --shm-size bytes              设置/dev/shm大小
# --sig-proxy【简写：-s】         代理接收的所有信号
# --stop-signal string         停止容器的自定义信号
# --stop-timeout int           使用SIGTERM+等待N秒后使用SIGKILL停止容器
# --storage-opt=[]              设置存储驱动选项
# --sysctl=[]                   设置sysctl选项
# --tmpfs=[]                    在容器中挂载临时文件系统
# --tty【简写：-t】              分配一个伪TTY
# --ulimit option              Ulimit选项
# --user string                用户名或UID(格式: <name|uid>[:<group|gid>])
# --userns-mode string         User namespace的模式
# --uts string                   UTS命名空间模式
# --volume【简写：-v】 list       绑定挂载一个卷
# --volume-driver string       指定自定义卷驱动程序
# --volumes-from=[]             从指定容器挂载卷
# --workdir【简写：-w】 string     容器的工作目录
```

*示例*：

```sh
# 启动一个nginx容器
docker run -d --name postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=12345678 \
    -p 5432:5432 \
    postgres:16.3
```

守护方式创建容器：

```sh
docker run -di --name 容器名称 镜像名称:标签
```

## 进入容器

使用 `docker exec` 命令进入容器。

*语法格式*：

```sh
# OPTIONS：选项
# CONTAINER：容器ID或容器名
# COMMAND：要执行的命令
# ARG：命令的参数
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

# OPTIONS：选项详细说明
# --detach【简写：-d】：分离模式：在后台运行命令。
# --detach-keys string：覆盖分离容器的按键顺序。
# --env list【简写：-e】：设置环境变量。
# --env-file list：读取环境变量文件。
# --interactive【简写：-i】：即使未连接，也要保持 STDIN 开放。
# --privileged：授予命令扩展权限
# --tty【简写：-t】：分配一个伪 TTY。
# --user string【简写：-u】：用户名或 UID（格式：“<name|uid>[:<group|gid>]”）。
# --workdir string【简写：-w】：容器内的工作目录。
```

*示例*：

```sh
# 这是常用的方式，使用 shell 的交互式模式进入容器
docker exec -it postgres /bin/bash
```

**注意：Docker 容器运行必须有一个前台进程， 如果没有前台进程执行，容器认为是空闲状态，就会自动退出。**

## 停止容器和启动容器

::: code-group
```sh [停止容器]
# 停止容器
docker stop 容器ID或容器名称

# 等待 15 秒钟，在这 15 秒内尝试优雅地停止容器
docker stop -t 15 容器ID或容器名称

# 停止所有正在运行的容器
docker stop $(docker ps -q)
```

```sh [启动容器]
# 启动容器
docker start 容器ID或容器名称

# 启动所有停止的容器
docker start $(docker ps -aq)
```
:::

## 删除容器

使用 `docker rm` 命令删除容器。

*语法格式*：

```sh
# OPTIONS：选项
# CONTAINER：容器ID或容器名
docker rm [OPTIONS] CONTAINER [CONTAINER...]

# OPTIONS：选项详细说明
# --force【简写：-f】：强制删除正在运行的容器（使用 SIGKILL）。
# --link【简写：-l】：移除指定链接。
# --volumes【简写：-v】：删除与容器关联的匿名卷。
```