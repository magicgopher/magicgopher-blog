---
title: Kubernetes
author: MagicGopher
keywords: Kubernetes, Kubernetes安装前准备
description: 介绍 Kubernetes 安装前准备
editLink: false
---

# Kubernetes安装前准备

## 安装环境概述

本次安装 Kubernetes 采用 Ubuntu Server X64 22.04 LTS 版本安装 Kubernetes 集群，集群节点为 1 主 2 从模式，此次对虚拟机会有些基本要求，如下：

- OS：Ubuntu Server X64 22.04 LTS
- CPU：最低要求，1 CPU 2 核
- 内存：最低要求，2 GB
- 磁盘：最低要求，20 GB

## 各个节点配置说明

| 主机名称             | IP地址         | 角色      | OS                  | CPU/内存 | 硬盘 |
| -------------------- | -------------- | --------- | ------------------- | -------- | ---- |
| kubernetes-master | 192.168.52.100 | master    | Ubuntu Server 22.04 | 2核心/4G | 20G  |
| kubernetes-worker-01 | 192.168.52.121 | worker-01 | Ubuntu Server 22.04 | 2核心/4G | 20G  |
| kubernetes-worker-02 | 192.168.52.122 | worker-02 | Ubuntu Server 22.04 | 2核心/4G | 20G  |



## 统一环境配置

本教程安装 Kubernetes 版本为 v1.34.2 版本。

注意：以下步骤请在制作 VMWare 镜像时一并完成，避免逐台安装的痛苦！

本次安装采用的方式是：安装一台虚拟机，使用的操作系统是Ubuntu Server 22.04，虚拟机上安装 Docker 以及 `kubeadm`、`kubectl`、`kubelet`、时间同步服务器，然后在基于这台虚拟机克隆 `kubernetes-master`、`kubernetes-worker-01`、`kubernetes-worker-02`。

### 配置 root 用户

配置 root 用户的密码：

```shell
# 配置root账户
sudo passwd root

# 输出如下
[sudo] password for 普通用户: # 这里输入当前用户的登录密码
New password: # root用户密码
Retype new password: # 再次确认root用户密码
passwd: password updated successfully # root 用户密码设置成功
```

切换到 root 用户

```shell
su root
```

### 配置软件源

使用 vim 编辑 Ubuntu 软件源【清空  sources.list 文件中的内容，或者使用 # 注释旧的软件源】。

```shell
vim /etc/apt/sources.list
```

Ubuntu 22.04（jammy）几个国内源如下：

::: code-group
```shell [阿里]
sudo bash -c "cat << EOF > /etc/apt/sources.list && apt update
deb http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
EOF"
```

```shell [中科大]
sudo bash -c "cat << EOF > /etc/apt/sources.list && apt update
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
EOF"
```

```shell [网易]
sudo bash -c "cat << EOF > /etc/apt/sources.list && apt update
deb http://mirrors.163.com/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ jammy-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ jammy-proposed main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ jammy-backports main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ jammy main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ jammy-security main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ jammy-updates main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ jammy-proposed main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ jammy-backports main restricted universe multiverse
EOF"
```
:::

更新软件源

```shell
apt-get update
````

### 配置ssh

安装 `openssh-server`【如果已经安装可以忽略此步骤，查看是否安装了 `openssh-server` 可以使用 `ssh -V` 查看】

```shell
apt-get install openssh-server
```

配置 root 用户使用ssh协议远程连接。

```shell
# 编辑sshd_config配置文件，按Enter查看sshd_config文件
vi /etc/ssh/sshd_config

# 找到PermitRootLogin prohibit-password，按i键进去编辑模式，将前面的#号删除
# 然后将PermitRootLogin prohibit-password修改成：PermitRootLogin yes
# 再然后按ESC键，按shift键 + ；键，然后出现一个:  在: 后面输入wq!，再按Enter键位接口。
PermitRootLogin yes
```

修改 sshd_config 配置后，需要执行一下命令，使其配置生效。

```shell
# 重新加载一下sshd_config配置文件，使其生效
service ssh restart
```

配置 ssh 之后，就可以使用终端的方式来连接 Ubuntu Server 22.04 机器，来执行一系列操作。

::: code-group
```shell [root]
# ssh命令格式：ssh 用户名@IP地址
# 执行ssh命令之后需要输入用户对应的密码
ssh root@IP地址
```

```shell [普通用户]
# 如果使用普通用户ssh进行连接，可以使用su来切换为root用户
su
或者
su root
```
:::

连接Linux服务器时出现 `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED`，会导致这一警告信息是因为，第一次进行SSH连接时，会生成一个认证存储在客户端中的 `known_hosts`，但如果服务器重新装过或认证信息发生变化。这时候服务器和客户端的信息不匹配时，就会出现错误。解决办法就是将 `known_hosts` 文件中那个无效的记录删除即可。

报错信息如下：

```shell
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
```

解决办法，如下：

```shell
ssh-keygen -R 目标主机IP地址
```

### 配置内核转发以及网桥过滤

```shell
# 创建加载内核模块文件
cat << EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
```

```shell
# 手动加载此模块
# 先执行这个
sudo modprobe overlay
# 再执行这个
sudo modprobe br_netfilter
```

```shell
# 查看已加载的模块
lsmod | egrep "overlay"

# 输出如下
overlay               151552  0
```

```shell
# 查看已加载的模块
lsmod | egrep "br_netfilter"

# 输出如下
br_netfilter           32768  0
bridge                311296  1 br_netfilter
```

```shell
# 添加网桥过滤及内核转发配置文件
cat << EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
```

```shell
# 应用 sysctl 参数而不重新启动
sudo sysctl --system
```

### 安装 ipset 及 ipvsadm

更新软件源列表并安装 `ipset`、`ipvsadm`。

```shell
apt-get -y update && apt-get install ipset ipvsadm
```

为了确保这些模块在系统重启后自动加载，可以将它们添加到 `/etc/modules-load.d/ipvs.conf` 文件。

```shell
cat << EOF | sudo tee /etc/modules-load.d/ipvs.conf
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack
EOF
```

创建加载模块脚本文件。

```shell
cat << EOF | sudo tee ipvs.sh
#!/bin/sh
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack
EOF
```

执行脚本文件，加载模块【执行完成之后可以删除 `ipvs.sh` 脚本文件】。

```shell
sudo sh ipvs.sh
```

### 设置 swap 空间

临时关闭 swap 空间

```shell
swapoff -a
```

查看交换空间情况 Swap全部为:0

```shell
free
```

设置交换空间，避免开机启动交换空间，注释 `/swap` 开头的行，使用 `#` 注释。

```shell
vi /etc/fstab
```

### 关闭防火墙

防火墙在系统启动时停止并禁用。

```shell
ufw disable
```

执行之后，输入：Firewall stopped and disabled on system startup。

### 配置DNS

取消 DNS 行注释，并增加 DNS 配置如：114.114.114.114，修改后重启下计算机【使用shutdown -r now】。

```shell
vi /etc/systemd/resolved.conf
```

### 安装 Docker

更新数据源。

```shell
apt-get update
```

安装必要的前置依赖，这里会出现【Do you want to continue? [Y/n]】直接回车【Enter】。

```shell
apt-get install -y apt-transport-https ca-certificates curl gnupg
```

创建 keyrings 目录（新版 apt 要求）

```shell
install -m 0755 -d /etc/apt/keyrings
```

安装 GPG 证书。

::: code-group
```shell [阿里云的GPG密钥]
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

```shell [Docker的官方GPG密钥]
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```
:::

给密钥添加读取权限

```shell
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

新增数据源，这里会出现【Press [ENTER] to continue or Ctrl-c to cancel.】直接回车【Enter】。

::: code-group
```shell [阿里云数据源]
cat <<EOF | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
$(lsb_release -cs) stable
EOF
```

```shell [Docker官方数据源]
cat <<EOF | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) stable
EOF
```
:::

再次更新软件源。

```shell
apt-get -y update
```

安装 `Docker CE`。

```shell
apt-get -y install docker-ce docker-ce-cli
```

验证 `Docker` 是否安装成功。

```shell
docker version

# 安装成功，输入如下
Client: Docker Engine - Community
 Version:           27.3.1
 API version:       1.47
 Go version:        go1.22.7
 Git commit:        ce12230
 Built:             Fri Sep 20 11:41:00 2024
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          27.3.1
  API version:      1.47 (minimum version 1.24)
  Go version:       go1.22.7
  Git commit:       41ca978
  Built:            Fri Sep 20 11:41:00 2024
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.7.23
  GitCommit:        57f17b0a6295a39009d861b89e3b3b87b005ca27
 runc:
  Version:          1.1.14
  GitCommit:        v1.1.14-0-g2c9f560
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

将 `Docker` 服务设置为开机自启，并立即启动 `Docker` 服务。

```shell
systemctl enable --now docker
```

验证 Docker 是否设置为开机启动。

```shell
# 是否已开机自启（enabled 表示开机自动启动，disabled 表示不会自启）
systemctl is-enabled docker

# 当前是否正在运行（active 表示正在运行，inactive 表示已停止）
systemctl is-active docker
```

### 配置 daemon.json

创建 `daemon.json` 配置文件，内容如下：

```shell
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.cattt.net",
    "https://docker.xuanyuan.me",
    "https://hub.mirrorify.net",
    "https://proxy.vvvv.ee",
    "https://docker.etcd.fun",
    "https://docker.m.ixdev.cn",
    "https://docker.kejilion.pro",
    "https://dockerproxy.net",
    "https://2a6bf1988cb6428c877f723ec7530dbc.mirror.swr.myhuaweicloud.com"
  ],
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ]
}
EOF
```

::: tip 提示
Docker镜像加速可在此镜像站获取：https://mirror.kentxxq.com
:::

重新加载配置文件。

```shell
systemctl daemon-reload
```

重启Docker。

```shell
systemctl restart docker
```

查看 Docker 是否正常运行。

```shell
# 当前是否正在运行（active 表示正在运行，inactive 表示已停止）
systemctl is-active docker
```

### 安装 cri-dockerd

下载 cri-dockerd 安装包，这里我使用的是 Ubuntu 22.04 版本【机器是x86的】，所以选择 jammy_amd64；机器是arm版本的就选arm版本的。

关于 ubuntu 版本的代号可以使用 `lsb_release -a` 命令查看。

![Kubernetes Logo](/images/docs/Kubernetes/Kubernetes学习笔记/assets/image-02.png)

cri-dockerd仓库地址：[https://github.com/Mirantis/cri-dockerd](https://github.com/Mirantis/cri-dockerd)

::: code-group
```shell [GitHub下载]
wget https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.21/cri-dockerd_0.3.21.3-0.ubuntu-jammy_amd64.deb
```

```[GitHub代理下载]
wget https://ghfast.top/https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.21/cri-dockerd_0.3.21.3-0.ubuntu-jammy_amd64.deb
```
:::

::: tip 提示
wget下载GitHub上的东西慢，可以使用GitHub代理。
GitHub代理：https://ghfast.top/
:::

使用 dpkg 的方式安装 deb 安装包。

```shell
dpkg -i <安装包名称>


# 安装
dpkg -i cri-dockerd_0.3.21.3-0.ubuntu-jammy_amd64.deb

# 输出如下
Selecting previously unselected package cri-dockerd.
(Reading database ... 111155 files and directories currently installed.)
Preparing to unpack cri-dockerd_0.3.21.3-0.ubuntu-jammy_amd64.deb ...
Unpacking cri-dockerd (0.3.21~3-0~ubuntu-jammy) ...
Setting up cri-dockerd (0.3.21~3-0~ubuntu-jammy) ...
Created symlink /etc/systemd/system/multi-user.target.wants/cri-docker.service → /lib/systemd/system/cri-docker.service.
Created symlink /etc/systemd/system/sockets.target.wants/cri-docker.socket → /lib/systemd/system/cri-docker.socket.
```

设置 cri-dockerd 开机启动

```shell
systemctl enable --now cri-docker
```

验证 `cri-dockerd` 是否设置为开机启动。

```shell
# 是否已开机自启（enabled 表示开机自动启动，disabled 表示不会自启）
systemctl is-enabled cri-docker

# 当前是否正在运行（active 表示正在运行，inactive 表示已停止）
systemctl is-active cri-docker

# 查看版本
cri-dockerd --version
```

### 安装 Kubernetes 必备工具

安装系统工具。

```shell
apt-get update && apt-get install -y apt-transport-https
```

Kubernetes 阿里云镜像地址：[https://mirrors.aliyun.com/kubernetes-new/core/stable/](https://mirrors.aliyun.com/kubernetes-new/core/stable/)

安装阿里云 GPG 证书。

```shell
curl -fsSL https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.34/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

写入软件源

```shell
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.34/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

再次更新软件源

```shell
apt-get -y update
```

查看kubuadm、kubectl、kubelet 可下载的版本。

```shell
apt-cache madison kubelet kubeadm kubectl
```

指定安装kubeadm、kubelet、kubectl工具，指定安装版本为 `1.34.2-1.1` 版本。

```shell
apt-get update && apt-get install -y kubelet=1.34.2-1.1 kubeadm=1.34.2-1.1 kubectl=1.34.2-1.1
```

锁定安装kubeadm、kubelet、kubectl工具的版本，防止后期自动更新。

```shell
# 解锁版本，可以执行更新，使用 apt-mark unhold 命令
apt-mark hold kubelet kubeadm kubectl
```

为了实现容器运行时使用的cgroupdriver与kubelet使用的cgroup的一致性，建议修改如下 `/etc/default/kubelet` 文件内容。

```shell
KUBELET_EXTRA_ARGS="--cgroup-driver=systemd"
```

设置开机开启kubelet。

```shell
systemctl enable kubelet
```

验证kubelet是否开启启动以及正常运行。

```shell
# 是否已开机自启（enabled 表示开机自动启动，disabled 表示不会自启）
systemctl is-enabled kubelet

# 当前是否正在运行（active 表示正在运行，inactive 表示已停止）
systemctl is-active kubelet
```

### 设置同步时间

设置时区，这里选择时区是 `Asia` 的 `Shanghai` 时区。

```shell
dpkg-reconfigure tzdata
```

安装 `ntpdate`。

```shell
apt-get install ntpdate
```

设置系统时间与网络时间同步（cn.pool.ntp.org 位于[中国的公共 NTP 服务器](https://dns.icoa.cn/ntp/)）

```shell
ntpdate cn.pool.ntp.org
```

将系统时间写入硬件时间

```shell
hwclock --systohc
```

确认虚拟机的时间是否和宿主机的一致

```shell
date
```

### 修改 cloud.cfg

防止虚拟机主机名还原，将 `preserve_hostname` 配置修改为 `true`，修改完成后，按 `esc` 键，然后 `:wq!` 保存退出即可。

```shell
vi /etc/cloud/cloud.cfg
```

### 重启再关闭虚拟机

先重启虚拟机

```shell
shutdown -r now
```

再关闭虚拟机

```shell
shutdown -h now
```

## 单独节点配置

### 单独节点配置说明

将上面表格中的信息分别用配置好的基础机器再基于基础机器完整克隆出 `kubernetes-master`、`kubernetes-worker-01`、`kubernetes-worker-02` 机器。

需要为 `kubernetes-master` 和 `kubernetes-worker-01`、`kubernetes-worker-02` 节点单独配置对应的IP地址和主机名称，[上面表格中有说明](#各个节点配置说明)。

### 配置主机名称

修改主机名称，具体内容如下所示：

::: code-group
```shell [master]
hostnamectl set-hostname kubernetes-master
```

```shell [worker-01]
hostnamectl set-hostname kubernetes-worker-01
```

```shell [worker-02]
hostnamectl set-hostname kubernetes-worker-02
```
:::

### 配置hosts域名

修改相关hosts域名的配置，具体内容如下所示：

::: code-group
```shell [master]
cat >> /etc/hosts << EOF
192.168.52.100 kubernetes-master
EOF
```

```shell [worker-01]
cat >> /etc/hosts << EOF
192.168.52.121 kubernetes-worker-01
EOF
```

```shell [worker-02]
cat >> /etc/hosts << EOF
192.168.52.122 kubernetes-worker-02
EOF
```
:::

### IP地址配置

编辑 `/etc/netplan/01-network-manager-all.yaml` 配置文件（没有该文件就创建），内容如下：

::: code-group
```yaml [master]
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: no
      addresses:
        - 192.168.52.100/24
      routes:
        - to: default
          via: 192.168.52.2
      nameservers:
        addresses: [114.114.114.114,8.8.8.8]
```

```yaml [worker-01]
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: no
      addresses:
        - 192.168.52.121/24
      routes:
        - to: default
          via: 192.168.52.2
      nameservers:
        addresses: [114.114.114.114,8.8.8.8]
```

```yaml [worker-02]
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:
      dhcp4: no
      addresses:
        - 192.168.52.122/24
      routes:
        - to: default
          via: 192.168.52.2
      nameservers:
        addresses: [114.114.114.114,8.8.8.8]
```
:::

routes 部分用于指定网络路由。via 后面的地址 192.168.52.2 是默认网关（gateway）的 IP 地址，可以通过以下命令获取到默认网关。

```shell
ip route show | grep "default"
```

应用 `/etc/netplan/` 目录中的配置文件生效，使用以下命令：

```shell
netplan apply
```

## 参考资料

- [https://kubernetes.io](https://kubernetes.io)