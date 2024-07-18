# Docker镜像管理

## 查看镜像

> 使用 docker images 命令或者 docker image ls 命令查看镜像。

*语法格式*：

```sh
# OPTIONS：镜像选项
# [REPOSITORY[:TAG]]：镜像名称或者镜像名称:TAG
docker images [OPTIONS] [REPOSITORY[:TAG]]

# OPTIONS：镜像选项详细说明
# --all【简写：-a】：列出所有镜像，包括中间镜像
# --digests：列出镜像摘要
# --filter filter【简写 -f】：根据提供的条件过滤输出
# --format string：使用自定义模板格式化输出
# --no-trunc：不截断输出
# --quiet【简写：-q】：仅显示镜像的ID
```

*示例*：

```sh
# 使用 docker images 命令 或者 docker image ls
docker images

# 输出如下
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
mysql        8.4.1     6d237f79428a   9 days ago     591MB
postgres     16.3      ebf3cbeb467b   2 months ago   453MB

# 只显示镜像ID
docker images -q
6d237f79428a
ebf3cbeb467b
```

输出内容详细说明：
- `REPOSITORY`：镜像仓库
- `TAG`：镜像标签
- `IMAGE ID`：镜像ID
- `CREATED`：创建时间
- `SIZE`：镜像大小

## 搜索镜像

> 可以通过以下命令搜索 Docker 仓库中的镜像。优先级：先搜索官方公共仓库【[Docker Hub](https://hub.docker.com/)】，再搜索私有仓库【Harbor、Docker Registry这些】。

*语法格式*：

```sh
# OPTIONS：搜索选项
# TERM：搜索关键字
docker search [OPTIONS] TERM

# OPTIONS：搜索选项详细说明
# --filter filter【简写 -f】：根据提供的条件过滤输出
# --format string 使用 Go 模板进行漂亮打印搜索
# --limit int 显示镜像数量
# --no-trunc：不截断输出
```

*示例*：

```sh
# 搜索 golang 镜像
docker search golang

# 按照STARS数至少10的镜像搜索
docker search --filter "stars=10" golang

# 搜索输出信息自定义格式
docker search --format "镜像名称:{{.Name}} - 描述:{{.Description}} [stars数量:{{.StarCount}}, 是否 docker 官方发布: {{.IsOfficial}}, 自动构建:{{.IsAutomated}}]" golang

# 只显示搜索结果的前5条
docker search --limit 5 golang

# 不截断输出，有多少内容就会展现多少内容
docker search --no-trunc golang
````

```sh
# 示例：这里只显示前面8条搜索结果
docker search --limit 8 golang

# 输出如下：
NAME                            DESCRIPTION                                     STARS     OFFICIAL
golang                          Go (golang) is a general purpose, higher-lev…   4893      [OK]
circleci/golang                 CircleCI images for Go                          19
okteto/golang                   Development environment for golang              6
bitnami/golang                  Bitnami container image for Go                  10
portainer/golang-builder        Utility to build Golang binaries.               8
balenalib/amd64-golang          This image is part of the balena.io base ima…   0
rancher/golang                                                                  0
balenalib/amd64-ubuntu-golang   This image is part of the balena.io base ima…   1
```

输出内容详细说明：
- `NAME`：镜像名称
- `DESCRIPTION`：镜像描述
- `STARS`：镜像的星级，即被多少人收藏
- `OFFICIAL`：是否为官方镜像

## 拉取镜像

> 这里拉取镜像的意思就是将镜像从 Docker 仓库拉取【下载】到本地。

*语法格式*：

```sh
# OPTIONS：拉取选项
# NAME：镜像名称
# TAG：镜像标签
# DIGEST：镜像摘要，摘要是一个唯一标识镜像内容的哈希值
docker pull [OPTIONS] NAME[:TAG|@DIGEST]

# OPTIONS：拉取选项详细说明
# --all-tags【简写：-a】：拉取镜像的所有标签
# --disable-content-trust：禁用镜像内容校验
# --platform string：指定镜像的运行平台
# --quiet【简写：-q】：不输出日志
```

*示例*：

```sh
# 拉取 redis 镜像，版本是latest版本
docker pull redis:latest

# 拉取 redis:latest 镜像，不输出日志信息
docker pull -q redis:latest

# 拉取 redis:latest 镜像的所有标签，例如：docker search redis 有5个标签，所以会拉取5个标签
docker pull -a redis

# 拉取指定平台的镜像
docker pull --platform linux/arm/v7 redis

# 禁用镜像内容校验
# 通常情况下，当您从Docker Hub或其他Docker镜像仓库拉取镜像时。
# Docker客户端会自动验证镜像的内容。这个过程被称为内容信任验证，它可以确保您获取到的镜像没有被篡改或恶意修改。
docker pull --disable-content-trust nginx:latest
```

## 删除镜像

> 删除镜像需要知道镜像的ID或者镜像名称。

*语法格式*：

```sh
# OPTIONS：删除选项
# IMAGE：镜像名称 或者 镜像ID 或者 镜像名称:TAG
# [IMAGE...]：多个镜像名称
docker rmi [OPTIONS] IMAGE [IMAGE...]

# OPTIONS：删除选项详细说明
# --force【简写：-f】：强制删除镜像
# --no-prune：可以用来控制是否同时删除未标记的父镜像，会将父镜像保留在本地
```

*示例*：

```sh
# 删除 redis 镜像
docker rmi redis

# 删除 redis:latest 镜像【这里有TAG版本号】
docker rmi redis:latest

# 删除所有镜像(某些镜像正在被容器使用，则无法直接删除，需要将容器停止)
docker rmi $(docker images -q)

# 删除所有镜像(删除所有镜像，包括中间镜像)这里使用-f参数强制删除
docker rmi -f $(docker images -q)
```

## 分层镜像

> 每个镜像都是通过 DockerFile 文本文件定义的，Dockerfile 中的每条指令最终都会成为镜像中的 Layer。Layer 是按顺序构成的，最底层的 Layer 是基础镜像（base image），最上层是最终镜像（final image）。当一个镜像被更新或重新构建时，只有更新的层需要修改，其他没有更新的层可以直接复用本地缓存。这就是 Docker 镜像如此快速和轻量级的部分原因，每一层的大小加起来等于最终镜像的大小。

理解上面的设计之后，我们现在来解释最上面关于 Layer 这个概念。假设我们的 Dockerfile 定义如下：

```DockerFile
FROM debian
RUN apt-get update && apt-get -y -f install emacs
RUN apt-get update && apt-get -y -f install apache2
```

上面一共有三条指令，如果编译这个 Dockerfile，其会生成三个镜像：

```sh
> docker build -t iteblog-docker ./
Sending build context to Docker daemon  2.048kB
Step 1/3: FROM debian
---> a8797652cfd9
Step 2/3: RUN apt-get update && apt-get -y -f install emacs
---> Using cache
---> 4b2cc711d0f1
Step 3/3: RUN apt-get update && apt-get -y -f installapache2
---> Using cache
---> 48ec647c89a1
Successfully built 48ec647c89a1
Successfully tagged iteblog-docker:latest
```

如果用图片表示的话，这个过程如下：

![image-06](./assets/image-06.png)

## 分层镜像原理

> 为什么centos镜像只有200多MB？

因为centos镜像使用了宿主机的内核。

![image-07](./assets/image-07.png)

**base镜像的定义**
1. 不依赖其他镜像，从scratch构建。
2. 其他镜像可以在其基础进行扩展。

base镜像一般都是各种Linux发行版本的Docker镜像，比如：Ubuntu，Debian或者CentOS等。

Linux操作系统由用户空间和内核空间构成。

内核空间是`kernel`，用户空间是`rootfs`，不同发行版的区别主要是rootfs。比如Ubuntu 14.04使用 upstart 管理服务，apt 管理软件包；而 CentOS 7 使用 systemd 和 yum。这些都是用户空间的不同，Kernel差别不大。

所以Docker可以同时支持多种 Linux 镜像，模拟出不同的操作系统环境。

> 为什么jdk的镜像有500多MB？

![image-08](./assets/image-08.png)

jdk镜像包含了rootfs和jdk本身，所以jdk的镜像要加上rootfs的大小，才是jdk镜像的大小。

> 为什么tomcat正常下载几十MB，镜像却要几百MB？

![image-09](./assets/image-09.png)

**分层说明**

![image-10](./assets/image-10.png)

**修改时复制策略（copy-on-write）**

Docker通过一个修改时复制策略来保证base镜像的安全性，以及更高的性能和空间利用率。

- 当容器需要读取文件的时候

从最上层的镜像层开始往下找，找到后读取到内存中，若已经在内存中，可以直接使用。换句话说，运行在同一台机器上的Docker容器共享运行时相同的文件。

- 当容器需要修改文件的时候

从上往下查找，找到后复制到容器层，对于容器来说，可以看到的是容器层的这个文件，看不到镜像层里的文件，然后直接修改容器层的文件。

- 当容器需要删除文件的时候

从上往下查找，找到后在容器中记录删除，并不是真正的删除，而是软删除。这导致镜像体积只会增加，不会减少。

当容器需要增加文件的时候，直接在最上层的容器可写层增加，不会影响镜像层。

## 镜像备份和恢复

> 使用 `docker save` 将指定镜像保存成 tar 归档文件。

*语法格式*：

```sh
# OPTIONS：保存选项
# IMAGE：镜像名称 或者 镜像ID 或者 镜像名称:TAG
docker save [OPTIONS] IMAGE [IMAGE...]

# OPTIONS：保存选项详细说明
# --output【简写：-o】：指定输出文件
```

*示例*：

```sh
# 将 apache/rocketmq:4.9.8 镜像保存成 tar 归档文件
# 这里会将tar归档文件保存到当前目录下
docker save -o apache-rocketmq-4.9.8.tar apache/rocketmq:4.9.8
# 或者
docker save > apache/rocketmq:4.9.8 apache-rocketmq-4.9.8.tar
```

示例详细说明：
- 其中-o和>表示输出到文件，apache-rocketmq-4.9.8.tar为目标文件，apache/rocketmq:4.9.8是源镜像名（name:tag）

> 使用 `docker load` 导入 docker save 命令导出的镜像归档文件。

*语法格式*：

```sh
# OPTIONS：导入选项
docker load [OPTIONS]

# OPTIONS：导入选项详细说明
# --input【简写：-i】：指定导入的文件
# --quiet【简写：-q】：精简输出信息
```

*示例*：

```sh
# 导入 apache-rocketmq-4.9.8.tar 镜像
docker load -i apache-rocketmq-4.9.8.tar
b3dd95159378: Loading layer [==================================================>]  435.5MB/435.5MB
3ac24fd02974: Loading layer [==================================================>]   16.9kB/16.9kB
f5e0c31e1ad3: Loading layer [==================================================>]  36.22MB/36.22MB
a436da1937ad: Loading layer [==================================================>]  36.22MB/36.22MB
Loaded image: apache/rocketmq:4.9.8
```