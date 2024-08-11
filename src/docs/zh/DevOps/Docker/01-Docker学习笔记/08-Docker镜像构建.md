---
title: Docker镜像构建
author: MagicGopher
keywords: Docker, Dockerfile
---

# Docker镜像构建

## Dockerfile

> 在 Docker 中构建镜像最常用的方式，就是使用 `Dockerfile`。Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。官方文档：[https://docs.docker.com/reference/dockerfile/](https://docs.docker.com/reference/dockerfile/)

### 支持的指令

#### FROM

> FROM 指令初始化新的构建阶段并为后续指令设置基础映像。因此，有效的 Dockerfile 必须以 FROM 指令开头。映像可以是任何有效映像。

*语法格式*：

```shell
# [--platform=<platform>]：指定构建镜像的目标平台，例如：--platform=linux/amd64 表示构建一个 amd64 架构的 Linux 平台的镜像
# <image>：这个是指定要使用的基础镜像，比如 ubuntu:20.04 表示使用 Ubuntu 20.04 作为基础镜像。
# [AS <name>]：这个选项用于给构建阶段指定一个名称。这样在后续的构建步骤中可以引用这个名称。比如 AS builder 就可以在后续步骤中引用 builder 这个名称。
FROM [--platform=<platform>] <image> [AS <name>]
# 或者
# [--platform=<platform>]：指定构建镜像的目标平台
# <image>[:<tag>]：用于指定基础镜像及其标签
# [AS <name>]：用于给构建阶段指定一个名称
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
# 或者
# [--platform=<platform>]：指定构建镜像的目标平台
# <image>[@<digest>]：用于指定基础镜像及其摘要
# [AS <name>]：用于给构建阶段指定一个名称
FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
```

*示例*：

```shell
# 如果没有选择 tag，那么默认值为 latest。
FROM ubuntu

# 选择 tag
FROM ubuntu:18.04

# 构建一个针对 ARM 64位架构的 Linux 镜像
# platform三个参数：linux/amd64、linux/arm64、windows/amd64
FROM --platform=linux/arm64 ubuntu:20.04
```

如果不以任何镜像为基础，那么写法为：FROM scratch。官方说明：scratch 镜像是一个空镜像，可以用于构建 busybox 等超小镜像，可以说是真正的从零开始构建属于自己的镜像。

关于 FROM 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#from](https://docs.docker.com/reference/dockerfile/#from)

#### MAINTAINER

> MAINTAINER 指令设置镜像的作者信息（一般是邮箱地址）。官方说明已过时，推荐使用 LABEL。

*语法格式*：

```shell
MAINTAINER <name>
```

*示例*：

```shell
MAINTAINER magicgopher <gopher997@gmail.com>
```

关于 MAINTAINER 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#maintainer-deprecated](https://docs.docker.com/reference/dockerfile/#maintainer-deprecated)

#### LABEL

> LABEL 指令设置镜像的标签信息。

*语法格式*：

```shell
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```

*示例*：

```shell
LABEL maintainer="gopher997@gmail.com"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

关于 LABEL 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#label](https://docs.docker.com/reference/dockerfile/#label)

#### RUN

> RUN 指令将执行任何命令以在当前镜像之上创建新层。添加的层将在 Dockerfile 中的下一步中使用。

*语法格式*：

::: code-group
```shell [第一种形式]
RUN [OPTIONS] <command> ...
```

```shell [第二种形式]
RUN [OPTIONS] [ "<command>", ... ]
```
:::

*示例*：

```shell
# 在构建镜像时执行Shell命令，安装curl
RUN apt-get update && apt-get install -y curl
```

关于 RUN 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#run](https://docs.docker.com/reference/dockerfile/#run)

#### ADD

> ADD 指令的作用是将指定的文件或目录从构建环境复制到容器镜像中。

*语法格式*：

::: code-group
```shell [第一种形式]]
ADD [OPTIONS] <src> ... <dest>
```

```shell [第二种形式]
ADD [OPTIONS] ["<src>", ... "<dest>"]
```
:::

*示例*：

```shell
# 这条ADD指令会自动将jdk-11.0.6_linux-x64_bin.tar.gz压缩包复制到容器的/usr/local/java目录下，并自动解压缩。
# 具体过程如下：
# ADD指令会先将jdk-11.0.6_linux-x64_bin.tar.gz压缩包复制到容器的/usr/local/java目录下。
# 由于jdk-11.0.6_linux-x64_bin.tar.gz是一个压缩包文件,ADD指令会自动对其进行解压缩。
# 解压缩完成后,/usr/local/java目录下就会出现解压后的JDK文件和目录结构。
ADD jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/java
```

关于 ADD 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#add](https://docs.docker.com/reference/dockerfile/#add)

#### COPY

> COPY 指令的作用是将指定的文件或目录从构建环境复制到容器镜像中。

*语法格式*：

::: code-group
```shell [第一种形式]
COPY [OPTIONS] <src> ... <dest>
```

```shell [第二种形式]
COPY [OPTIONS] ["<src>", ... "<dest>"]
```
:::

*示例*：

```shell
# 将当前目录下的 app.py 文件复制到容器的 /app 目录
COPY app.py /app

# 将 src 目录下的所有文件复制到容器的 /app 目录
COPY src/* /app
```

::: warning `COPY` 与 `ADD` 的区别
- **功能差异**
  - `ADD` 指令除了可以复制文件外，还可以自动处理压缩包文件，并将其解压缩到指定位置。
  - `COPY` 指令只能复制文件或目录，不支持自动解压缩。
- **远程资源下载**
  - `ADD` 指令可以接受 URL 作为源路径，并自动下载远程资源。
  - `COPY` 指令只能复制构建环境中的本地文件，不支持远程资源下载。
- **安全性**
  - `ADD` 指令在下载远程资源时存在一定的安全隐患，可能会引入恶意软件。
  - `COPY` 指令不会存在这种安全隐患，因为复制的是本地文件，不会进行网络请求。
- **文件元数据保留**
  - `ADD` 指令在复制文件时，会保留文件的元数据信息(如修改时间、权限等)。
  - `COPY` 指令只复制文件内容，不保留元数据信息。
:::

关于 ADD 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#copy](https://docs.docker.com/reference/dockerfile/#copy)

#### ENV

> ENV 指令在Dockerfile中用于设置环境变量。这些环境变量在容器运行时可被访问和使用。通过设置环境变量，你可以在构建镜像时传递配置信息或其他数据，而不需要硬编码在应用程序中。

*语法格式*：

```shell
ENV <key>=<value> ...
```

*示例*：

```shell
ENV APP_HOME=/usr/local/app
ENV APP_NAME=myapp
ENV APP_VERSION=1.0
ENV APP_PORT=8080
ENV APP_USER=appuser
ENV APP_PASSWORD=secret
```

关于 ENV 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#env](https://docs.docker.com/reference/dockerfile/#env)

#### WORKDIR

> WORKDIR 指令为 Dockerfile 中紧随其后的任何 RUN、CMD、ENTRYPOINT、COPY 和 ADD 指令设置工作目录。如果 WORKDIR 不存在，则即使在任何后续 Dockerfile 指令中未使用它，也会创建它。

*语法格式*：

```shell
WORKDIR /path/to/workdir
```

*示例*：

```shell
# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY . .

# Set the command to run the app
CMD ["python", "app.py"]
```

以上 WORKDIR 示例分析：
1. `FROM python:3.9-slim`: 这条指令从 Python 3.9 的官方镜像开始构建镜像。
2. `WORKDIR /app`: 这条指令设置了容器内的工作目录为 /app。所有后续的命令都会在这个目录下执行。
3. `COPY requirements.txt .`: 这条指令将本地的 requirements.txt 文件复制到容器内的当前工作目录 /app 下。
4. `RUN pip install --no-cache-dir -r requirements.txt`: 这条指令在 /app 目录下安装 Python 依赖包。
5. `COPY . .`: 指令将宿主机上的当前目录(.)下的所有文件和目录复制到容器内部的当前工作目录 /app 下。
6. `CMD ["python", "app.py"]`: 这条指令设置了容器启动时要运行的命令，即在 /app 目录下运行 python app.py。

关于 WORKDIR 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#workdir](https://docs.docker.com/reference/dockerfile/#workdir)

#### EXPOSE

> EXPOSE 指令通知 Docker 容器在运行时监听指定的网络端口。您可以指定端口监听 TCP 还是 UDP，如果您未指定协议，则默认为 TCP。实际上并不发布端口。它充当构建镜像的人员和运行容器的人员之间的一种文档，说明要发布哪些端口。要在运行容器时发布端口，请在 docker run 上使用 -p 标志来发布和映射一个或多个端口，或使用 -P 标志来发布所有公开的端口并将它们映射到高阶端口。

*语法格式*：

```shell
EXPOSE <port> [<port>/<protocol>...]
```

*示例*：

```shell
# 声明启动容器时开始监听8888端口
# 这里是容器的监听端口还没有和宿主机的端口做映射
EXPOSE 8888
```

关于 EXPOSE 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#expose](https://docs.docker.com/reference/dockerfile/#expose)

#### CMD

> CMD 指令设置从映像运行容器时要执行的命令。Dockerfile 中只能有一个 CMD 指令。如果您列出多个 CMD，则只有最后一个生效。

*语法格式*：

::: code-group
```shell [shell格式]
# 这种格式会在 shell 中执行指定的命令
CMD <command> <param1> <param2> ...
```

```shell [exec格式]
# 这种格式使用 JSON 数组的形式指定完整的执行命令
CMD ["executable", "param1", "param2", ...]
```

```shell [参数格式]
# 这种格式会被当作是传递给 ENTRYPOINT 指定的命令的参数
ENTRYPOINT ["top", "-b"]
CMD ["-c"]
```
:::

*示例*：

::: code-group
```shell [shell格式]
FROM ubuntu:18.04
CMD echo "Hello, World!"
```

```shell [exec格式]
FROM nginx:latest
CMD ["nginx", "-g", "daemon off;"]
```

```shell [参数格式]
FROM ubuntu:18.04
ENTRYPOINT ["top", "-b"]
CMD ["-c"]
```
:::

关于 CMD 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#cmd](https://docs.docker.com/reference/dockerfile/#cmd)

#### ENTRYPOINT

> ENTRYPOINT 指令设置容器启动时要执行的命令，启动容器时执行的 Shell 命令，同 CMD 类似，不会被 docker run 命令行指定的参数所覆盖。在 Dockerfile 中只能有一条 ENTRYPOINT 指令。如果设置了多条 ENTRYPOINT，只有最后一条 ENTRYPOINT 会生效。

*语法格式*：

::: code-group
```shell [shell格式]
# 这种格式会在 shell 中执行指定的命令
ENTRYPOINT command param1 param2 ...
```

```shell [exec格式]
# 这种格式使用 JSON 数组的形式指定完整的执行命令
ENTRYPOINT ["executable", "param1", "param2", ...]
```
:::

*示例*：

::: code-group
```shell [shell格式]
FROM ubuntu:18.04
ENTRYPOINT echo "Hello, World!"
```

```shell [exec格式]
FROM nginx:latest
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

```shell [与 CMD 指令配合使用]
FROM ubuntu:18.04
ENTRYPOINT ["top", "-b"]
CMD ["-c"]
```
:::

关于 ENTRYPOINT 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#entrypoint](https://docs.docker.com/reference/dockerfile/#entrypoint)

#### VOLUME

> VOLUME 指令用于在镜像内部创建一个可以挂载的挂载点，以实现数据的持久化存储，通过该指令用户可以在运行容器时挂载相应的数据卷，从而实现数据的持久化存储。

*语法格式*：

::: code-group
```shell [单一路径格式]
VOLUME /data
```

```shell [多个路径格式]
VOLUME /data1 /data2 /data3
```

```shell [JSON 数组格式]
VOLUME ["/data1", "/data2", "/data3"]
```
:::

*示例*：

::: code-group
```shell [单一路径格式]
FROM ubuntu:18.04
VOLUME /data
```

```shell [多个路径格式]
FROM ubuntu:18.04
VOLUME /data /logs
```

```shell [JSON 数组格式]
FROM ubuntu:18.04
VOLUME ["/data", "/logs"]
```
:::

关于 VOLUME 详细内容请参考官方文档：[https://docs.docker.com/reference/dockerfile/#volume](https://docs.docker.com/reference/dockerfile/#volume)

#### ARG

> ARG 指令定义了一个变量，用户可以在构建时使用 docker build 命令使用 `--build-arg <varname>=<value>` 标志将该变量传递给构建器。

*语法格式*：

```shell
ARG <name>[=<default value>]
```

*示例*：

```shell
FROM ubuntu:18.04

ARG APP_VERSION=1.0.0
ARG DB_HOST=localhost

RUN echo "Application version: $APP_VERSION"
RUN echo "Database host: $DB_HOST"

COPY app.py /app/app.py
CMD ["python", "/app/app.py"]
```

示例说明：
- 定义了两个 ARG 变量 APP_VERSION 和 DB_HOST。
- 在 RUN 指令中使用了这两个变量。
- 在构建镜像时,可以通过 --build-arg 参数为这些变量赋值。例如：`docker build --build-arg APP_VERSION=2.0.0 --build-arg DB_HOST=dbserver.local -t my-app .`

关于 ARG 详细内容请参考官方文档：[https://docs.docker.com/reference/builder/#arg](https://docs.docker.com/reference/builder/#arg)

#### ONBUILD

> ONBUILD 指令用于在当前镜像被作为基础镜像构建新的镜像时，触发执行指定的命令，也就是说，当这个镜像作为基础镜像被使用时 ONBUILD 指令会在构建新的镜像时被触发执行。

*语法格式*：

```shell
ONBUILD <指令>
```

*示例*：

```shell
# Dockerfile for base image
FROM ubuntu:18.04
ONBUILD COPY . /app
ONBUILD RUN cd /app && pip install -r requirements.txt
CMD ["python", "/app/app.py"]
```

示例说明：
- 定义了一个基础镜像，其中包含 ONBUILD 指令。
- 当这个基础镜像被用作其他镜像的基础镜像时 ONBUILD 指令会在构建新的镜像时被触发执行。
- 具体来说 ONBUILD 指令会在新镜像构建时：
  1. 将当前目录下的所有文件复制到容器的 /app 目录下。
  2. 进入 /app 目录并运行 pip install -r requirements.txt 命令。

关于 ONBUILD 详细内容请参考官方文档：[https://docs.docker.com/reference/builder/#onbuild](https://docs.docker.com/reference/builder/#onbuild)

#### STOPSIGNAL

> STOPSIGNAL 指令用于指定容器停止时的信号，默认为 SIGTERM。

*语法格式*：

```shell
STOPSIGNAL signal
```

*示例*：

```shell
FROM ubuntu:18.04

# 设置停止信号为 SIGINT (编号 2)
STOPSIGNAL SIGINT

# 启动应用程序
CMD ["my-app"]
```

关于 STOPSIGNAL 详细内容请参考官方文档：[https://docs.docker.com/reference/builder/#stopsignal](https://docs.docker.com/reference/builder/#stopsignal)

#### SHELL

> SHELL 指令允许覆盖 shell 形式命令使用的默认 shell。Linux 上的默认 shell 是 ["/bin/sh", "-c"]，Windows 上的默认 shell 是 ["cmd", "/S", "/C"]。SHELL 指令必须以 JSON 形式写入 Dockerfile 中。

*语法格式*：

```shell
SHELL ["executable", "parameters"]
```

*示例*：

```shell
FROM microsoft/windowsservercore

# Executed as cmd /S /C echo default
RUN echo default

# Executed as cmd /S /C powershell -command Write-Host default
RUN powershell -command Write-Host default

# Executed as powershell -command Write-Host hello
SHELL ["powershell", "-command"]
RUN Write-Host hello

# Executed as cmd /S /C echo hello
SHELL ["cmd", "/S", "/C"]
RUN echo hello
```

示例说明：
- 第一个 RUN 命令没有设置 SHELL 指令,因此默认使用 Windows 上的 cmd.exe shell 执行 echo default 命令,输出 "default"。
- 第二个 RUN 命令同样没有设置 SHELL 指令,默认使用 cmd.exe shell 执行 powershell -command Write-Host default 命令,在 PowerShell 中输出 "default"。
- 第三个 RUN 命令设置 SHELL 指令为 ["powershell", "-command"],因此执行 Write-Host hello 命令时,是在 PowerShell 中运行的,输出 "hello"。
- 第四个 RUN 命令设置 SHELL 指令为 ["cmd", "/S", "/C"],因此执行 echo hello 命令时,是在 cmd.exe 中运行的,输出 "hello"。

关于 SHELL 详细内容请参考官方文档：[https://docs.docker.com/reference/builder/#shell](https://docs.docker.com/reference/builder/#shell)

### 构建镜像

Dockerfile 文件编写好以后，真正构建镜像时需要通过 `docker build` 命令。

*语法格式*：

```shell
# OPTIONS：选项
# PATH：指定 Dockerfile 所在的本地路径。
# URL：指定 Git 仓库或者 HTTP/HTTPS URL 地址,Docker 会从该地址下载 Dockerfile 并构建镜像。
# -：表示从 STDIN (标准输入)读取 Dockerfile 内容。
docker build [OPTIONS] PATH | URL | -

# OPTIONS：选项详细说明
# --add-host list：添加自定义主机到 IP 映射（"host:ip"）
# --build-arg list：设置构建时变量
# --cache-from strings：作为缓存源的镜像
# --cgroup-parent string：设置构建期间 "RUN" 指令的父 cgroup
# --compress：使用 gzip 压缩构建上下文
# --cpu-period int：限制 CPU CFS（完全公平调度程序）周期
# --cpu-quota int：限制 CPU CFS（完全公平调度程序）配额
# -c, --cpu-shares int：CPU 份额（相对权重）
# --cpuset-cpus string：允许执行的 CPU（0-3, 0,1）
# --cpuset-mems string：允许执行的 MEM（0-3, 0,1）
# --disable-content-trust：跳过镜像验证（默认为 true）
# -f, --file string：Dockerfile 名称（默认为 "PATH/Dockerfile"）
# --force-rm：始终删除中间容器
# --iidfile string：将镜像 ID 写入文件
# --isolation string：容器隔离技术
# --label list：为镜像设置元数据
# -m, --memory bytes：内存限制
# --memory-swap bytes：交换限制等于内存加交换：-1 表示无限交换
# --network string：设置构建期间 "RUN" 指令的网络模式（默认为 "default"）
# --no-cache：构建镜像时不使用缓存
# --platform string：如果服务器是多平台支持的，则设置平台
# --pull：始终尝试拉取更新版本的镜像
# -q, --quiet：抑制构建输出并在成功时打印镜像 ID
# --rm：在成功构建后删除中间容器（默认为 true）
# --security-opt strings：安全选项
# --shm-size bytes："/dev/shm" 的大小
# -t, --tag list：名称和可选标签的格式为 "name:tag"
# --target string：设置要构建的目标构建阶段。
# --ulimit ulimit：ulimit 选项（默认为 []）
```

*示例*：

```shell
# 使用当前目录的 Dockerfile 创建镜像
docker build -t my-image:tag .

# 通过 -f Dockerfile 文件的位置创建镜像
docker build -f /path/Dockerfile -t my-image:tag .
```

#### 命令后面的点号说明

我们在使用 `docker build` 命令去构建镜像时，往往会看到命令最后会有一个 `.` 号。它究竟是什么意思呢？

很多人以为是用来指定 `Dockerfile` 文件所在的位置的，但其实 `-f` 参数才是用来指定 `Dockerfile` 的路径的，那么 `.` 号究竟是用来做什么的呢？

`Docker` 在运行时分为 `Docker 引擎（服务端守护进程）` 和 `客户端工具`，我们日常使用各种 `docker 命令`，其实就是在使用 `客户端工具` 与 `Docker 引擎` 进行交互。

当我们使用 `docker build` 命令来构建镜像时，这个构建过程其实是在 `Docker 引擎` 中完成的，而不是在本机环境。如果在 `Dockerfile` 中使用了一些 `ADD` 等指令来操作文件，如何让 `Docker 引擎` 获取到这些文件呢？

这里就有了一个 `镜像构建上下文` 的概念，当构建的时候，由用户指定构建镜像时的上下文路径，而 `docker build` 会将这个路径下所有的文件都打包上传给 `Docker 引擎`，引擎内将这些内容展开后，就能获取到上下文中的文件了。

举个例子：我的宿主机 jdk 文件在 /root 目录下，Dockerfile 文件在 /usr/local/dockerfile 目录下，文件内容如下：

```shell
ADD jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/java
```

那么构建镜像时的命令就该这样写：

```shell
docker build -f /usr/local/dockerfile/Dockerfile -t mycentos:7 /root
```

再举个例子：我的宿主机 jdk 文件和 Dockerfile 文件都在 /usr/local/dockerfile 目录下，文件内容如下：

```shell
ADD jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/java
```

那么构建镜像时的命令则这样写：

```shell
docker build -f /usr/local/dockerfile/Dockerfile -t mycentos:7 .
```

### 镜像构建示例

下来我们通过基础镜像 `ubuntu:18.04`，在该镜像中安装 jdk 和 tomcat 以后将其制作为一个新的镜像 `myubuntu:18.04`

创建目录：

```shell
# 创建一个 docker 目录并到该目录下
mkdir -p /myimage/docker && cd /myimage/docker
```

编写 Dockerfile 文件：

```shell
# 指明构建的新镜像是来自于 ubuntu:18.04 基础镜像
FROM ubuntu:18.04
# 通过镜像标签声明了作者信息
LABEL maintainer="gopher997@gmail.com"
# 设置工作目录
WORKDIR /usr/local
# 新镜像构建成功以后创建指定目录
RUN mkdir -p /usr/local/java && mkdir -p /usr/local/tomcat
# 拷贝文件到镜像中并解压
ADD jdk-11.0.23_linux-aarch64_bin.tar.gz /usr/local/java
ADD apache-tomcat-9.0.91.tar.gz /usr/local/tomcat
# 暴露容器运行时的 8080 监听端口给外部
EXPOSE 8080
# 设置容器内 JAVA_HOME 环境变量
ENV JAVA_HOME /usr/local/java/jdk-11.0.23/
ENV PATH $PATH:$JAVA_HOME/bin
# 启动容器时启动 tomcat
CMD ["/usr/local/tomcat/apache-tomcat-9.0.91/bin/catalina.sh", "run"]
```

以上 Dockerfile 文件需要注意的是 jdk 和 tomcat 需要和 Dockerfile 文件在同一目录下，否则构建会失败。

开始构建镜像：

```shell
docker build -t myubuntu:18.04 .
```

构建完成后，我们可以通过 `docker images` 命令查看构建的镜像：

```shell
docker images
REPOSITORY                     TAG           IMAGE ID       CREATED         SIZE
myubuntu                       18.04         286348ce57ac   4 seconds ago   356MB
```

使用构建的镜像来创建容器：

```shell
docker run -di --name myubuntu18 -p 8080:8080 myubuntu:18.04
```

访问 http://IP地址:8080/ 可以看到 tomcat 的欢迎页面，说明环境 OK!