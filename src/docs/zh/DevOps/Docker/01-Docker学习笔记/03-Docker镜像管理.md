# Docker镜像管理

## 查看镜像

使用 docker images 命令或者 docker image ls 命令查看镜像。

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

可以通过以下命令搜索 Docker 仓库中的镜像。优先级：先搜索官方公共仓库【[Docker Hub](https://hub.docker.com/)】，再搜索私有仓库【Harbor、Docker Registry这些】。

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

这里拉取镜像的意思就是将镜像从 Docker 仓库拉取【下载】到本地。

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
# 通常情况下,当您从Docker Hub或其他Docker镜像仓库拉取镜像时
# Docker客户端会自动验证镜像的内容。这个过程被称为内容信任验证，它可以确保您获取到的镜像没有被篡改或恶意修改。
docker pull --disable-content-trust nginx:latest
```

## 删除镜像

删除镜像需要知道镜像的ID或者镜像名称。

*语法格式*：

```sh
# OPTIONS：删除选项
# IMAGE：镜像名称 或者 镜像ID 或者 镜像名称:TAG
# [IMAGE...]：多个镜像名称
docker rmi [OPTIONS] IMAGE [IMAGE...]

# OPTIONS：删除选项详细说明
# --force【简写：-f】：强制删除镜像
# --no-prune：可以用来控制是否同时删除未标记的父镜像，会将父镜像保留在本地。
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