---
title: Docker安装
author: MagicGopher
keywords: docker
description: 介绍 Docker 在各个平台的安装方式
editLink: false
---

# Docker安装

## Ubuntu系统安装Docker

1. 更新软件源

```sh
apt-get update
```

2. 安装所需依赖，这里会出现界面需要选择yes

```sh
apt-get -y install apt-transport-https ca-certificates curl software-properties-common
```

3. 安装 GPG 证书

```sh
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

4. 新增数据源

```sh
add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
```

5. 更新并安装 Docker CE

```sh
apt-get -y update && apt-get install -y docker-ce
```

6. 设置Docker开机启动

```sh
systemctl enable docker

# /lib/systemd/systemd-sysv-install enable docker
```

## CentOS系统安装Docker

1. 卸载旧版本Docker

```sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

2. 安装所需依赖

```sh
# 安装yum-utils
sudo yum install -y yum-utils
# 添加Docker仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

3. 安装Docker CE

```sh
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4. 设置Docker开机启动

```sh
# 启动Docker
sudo systemctl start docker
# 设置开机启动
sudo systemctl enable docker
```

## MacOS系统安装Docker

在 MacOS 系统，我使用 [Colima](https://github.com/abiosoft/colima) 的方式来启动 [Docker](https://www.docker.com/) 容器。

1. 安装Homebrew

```sh
# arm版本
/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"

# x86版本
arch -x86_64 /bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
```

2. 设置Homebrew环境

```sh
# .zprofile
echo 'eval "$(/opt/homebrew/bin/brew shellenv)" #brew.idayer.com' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# .bash_profile
echo 'eval "$(/opt/homebrew/bin/brew shellenv)" #brew.idayer.com' >> ~/.bash_profile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

3. 使用 Homebrew 安装 Colima、Docker、Docker Compose

```sh
# 安装
brew install colima docker docker-compose
```

4. 启动 Colima

```sh
# 使用默认的配置启动colima
colima start

# 编辑colima配置文件的方式启动colima
colima start --edit
```

5. 配置Docker代理

```sh
# 需要先停止colima
colima stop

# 在 ～/.colima/default/colima.yaml 中添加代理配置，Clash 代理地址为例子。
env: 
    http_proxy: http://192.168.5.2:7890
    https_proxy: http://192.168.5.2:7890
    no_proxy: localhost,192.168.5.2

# 重启colima虚拟机的docker
colima ssh sudo systemctl daemon-reload
colima ssh sudo systemctl restart docker
```

## 参考资料

- [https://docs.docker.com/](https://docs.docker.com/)