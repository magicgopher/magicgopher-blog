# Kubernetes安装

## 安装环境概述

本次安装 Kubernetes 采用 Ubuntu Server X64 18.04 LTS 版本安装 Kubernetes 集群，集群节点为 1 主 2 从模式，此次对虚拟机会有些基本要求，如下：

- OS：Ubuntu Server X64 18.04 LTS
- CPU：最低要求，1 CPU 2 核
- 内存：最低要求，2 GB
- 磁盘：最低要求，20 GB

## 各个节点配置说明

| 主机名称           | IP地址         | 角色    | OS                  | CPU/内存 | 硬盘 |
| ------------------ | -------------- | ------- | ------------------- | -------- | ---- |
| Kubernetes-Master  | 192.168.74.110 | Master  | Ubuntu Server 18.04 | 2核心/4G | 20G  |
| Kubernetes-Node-01 | 192.168.74.150 | Node-01 | Ubuntu Server 18.04 | 2核心/4G | 20G  |
| Kubernetes-Node-02 | 192.168.74.151 | Node-02 | Ubuntu Server 18.04 | 2核心/4G | 20G  |

## 配置基础机器环境

本教程安装 Kubernetes 版本为 v1.31.2 版本。

注意：以下步骤请在制作 VMWare 镜像时一并完成，避免逐台安装的痛苦！

本次安装采用的方式是：安装一台虚拟机，操作系统是Ubuntu Server 18.04，机器上安装Docker以及kubeadm、kubectl、kubelet、时间同步服务器，然后在基于本机器克隆Kubernetes-Master机器、Kubernetes-Node-01机器、Kubernetes-Node-02机器。

Kubernetes 仓库地址：[https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)

阿里云 Ubuntu18.04（bionic）配置如下：

```shell
deb https://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse

deb https://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse

deb https://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse

# deb https://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
# deb-src https://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse

deb https://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```