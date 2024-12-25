---
title: 运行容器
author: MagicGopher
keywords: Kubernetes, Pod, Service, Deployment, ReplicaSet
description: 介绍如何在 Kubernetes 集群上运行容器
editLink: false
---

# 运行容器

## 查看组件运行状态

```shell
kubectl get cs

# 输出如下
NAME                 STATUS    MESSAGE   ERROR
# 负责将新创建的 Pod 分配到合适的节点上。
scheduler            Healthy   ok
# 自动化修复服务，主要作用是 Node 宕机后自动修复 Node 回到正常的工作状态
controller-manager   Healthy   ok
# 服务注册与发现和共享配置
etcd-0               Healthy   ok
```

## 查看 master 状态

```shell
kubectl cluster-info

# 输出如下
Kubernetes control plane is running at https://192.168.56.100:6443
CoreDNS is running at https://192.168.56.100:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

## 检查 Nodes 状态

```shell
kubectl get nodes

# 输出如下
NAME                   STATUS   ROLES           AGE   VERSION
kubernetes-worker-01   Ready    <none>          65m   v1.31.3
kubernetes-worker-02   Ready    <none>          52m   v1.31.3
node                   Ready    control-plane   77m   v1.31.3
```

## 运行一个容器

```shell
kubectl run my-nginx --image=nginx:latest --port=80

# 输出如下
pod/my-nginx created
```

**Kubernetes v1.18 之前**：
- kubectl run 是一个多功能命令，默认会创建 Deployment。
- 可以通过 --replicas 参数直接指定副本数量。
- 例如：`kubectl run nginx --image=nginx --replicas=3`

**Kubernetes v1.18 之后**：
- kubectl run 的功能被简化，只用于快速创建单个 Pod。
- 它不再创建 Deployment、ReplicaSet 或其他控制器资源。
- 例如：`kubectl run nginx --image=nginx`
- 仅会创建一个 Pod，且不会有副本控制功能。

## 查看全部 Pods 的状态

```shell
kubectl get pods

# 输出如下
NAME       READY   STATUS    RESTARTS   AGE
my-nginx   1/1     Running   0          69s
```

## 外部访问

- 创建一个 NodePort 类型的 Service，将 Pod 暴露到集群外部。

```shell
kubectl expose pod my-nginx --type=NodePort --port=80

# 输出如下
service/my-nginx exposed
```

- 通过以下命令获取 Service 的详细信息，包括分配的端口。

```shell
kubectl get services

# 输出如下
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP        92m
my-nginx     NodePort    10.102.139.144   <none>        80:<NodePort>/TCP   6m10s
```

- 获取 Kubernetes 集群中任意节点的 IP 地址，可以使用以下命令。

```shell
kubectl get nodes -o wide

# 输出如下
NAME                   STATUS   ROLES           AGE   VERSION   INTERNAL-IP      EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION       CONTAINER-RUNTIME
kubernetes-worker-01   Ready    <none>          80m   v1.31.3   192.168.56.121   <none>        Ubuntu 22.04.5 LTS   5.15.0-125-generic   docker://27.3.1
kubernetes-worker-02   Ready    <none>          68m   v1.31.3   192.168.56.122   <none>        Ubuntu 22.04.5 LTS   5.15.0-125-generic   docker://27.3.1
node                   Ready    control-plane   93m   v1.31.3   192.168.56.100   <none>        Ubuntu 22.04.5 LTS   5.15.0-125-generic   docker://27.3.1
```

- 通过浏览器访问暴露出去的 Pod（my-nginx）

```shell
http://<Node-IP>:<NodePort>/
```

浏览器访问，如下图所示：

![image-03](/images/docs/Kubernetes/Kubernetes学习笔记/assets/image-03.png)

![image-04](/images/docs/Kubernetes/Kubernetes学习笔记/assets/image-04.png)

![image-05](/images/docs/Kubernetes/Kubernetes学习笔记/assets/image-05.png)

## 停止服务

- 删除已部署的服务（Service）

```shell
kubectl delete service my-nginx

# 输出如下
service "my-nginx" deleted
```

- 删除 Pod

```shell
kubectl delete pod my-nginx

# 输出如下
pod "my-nginx" deleted
```

## 创建 Deployment

- 创建一个 Deployment 指定副本数量为 2。

```shell
kubectl create deployment my-nginx-deployment --image=nginx:latest --replicas=2

# 输出如下
deployment.apps/my-nginx-deployment created
```

- 查看 Deployment 的状态

```shell
kubectl get deployments

# 输出如下
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
my-nginx-deployment   2/2     2            2           72s
```

- 通过发布 Service 将 Pod 暴露到集群外部。

```shell
kubectl expose deployment my-nginx-deployment --port=80 --target-port=80 --type=NodePort

# 输出如下
service/my-nginx-deployment exposed
```

- 通过以下命令获取 Service 的详细信息，包括分配的端口。

```shell
kubectl get services

# 输出如下
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes            ClusterIP   10.96.0.1       <none>        443/TCP        140m
my-nginx-deployment   NodePort    10.110.20.192   <none>        80:<NodePort>/TCP   6s
```