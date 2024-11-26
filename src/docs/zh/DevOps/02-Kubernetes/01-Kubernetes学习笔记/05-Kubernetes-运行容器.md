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
# 
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
NAME                   STATUS   ROLES           AGE     VERSION
kubernetes-worker-01   Ready    <none>          3d      v1.31.2
kubernetes-worker-02   Ready    <none>          2d23h   v1.31.2
node                   Ready    control-plane   3d1h    v1.31.2
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

```shell
kubectl expose pod my-nginx --type=NodePort --port=80
```