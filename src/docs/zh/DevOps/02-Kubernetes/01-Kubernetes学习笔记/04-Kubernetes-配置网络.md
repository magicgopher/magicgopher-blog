# Kubernetes 配置网络

## 概述

容器网络是容器选择连接到其他容器、主机和外部网络的机制。容器的 runtime 提供了各种网络模式，每种模式都会产生不同的体验。

Docker 默认情况下可以为容器配置以下网络：

- **none**：容器不连接任何网络。它可以运行，但无法与其他容器或外部网络通信，适合需要完全隔离的场景。
- **host**：容器直接使用主机的网络栈。容器中的服务将直接绑定到主机的 IP 地址和端口，适合需要高性能网络的应用，但会失去容器的网络隔离特性。
- **default bridge**：Docker 默认提供的桥接网络。容器在此网络中可以通过容器名称进行通信，Docker 会为每个容器分配一个 IP 地址。适合简单的容器间通信。
- **自定义网桥**：用户可以创建自定义的桥接网络，以便更灵活地管理容器之间的通信。自定义网桥允许用户设置不同的子网、IP 范围和网络策略，适合复杂的应用场景。

Podman 和 Containerd 也提供网络配置选项：

- **Podman**：支持 bridge、host 和 none 模式，并使用 CNI 插件提供灵活的网络解决方案。
- **Containerd**：依赖 CNI 插件以支持多种网络模式和网络策略，适用在 Kubernetes 等编排工具中。

## 什么是 CNI

CNI（Container Network Interface）是一种用于容器网络连接的标准接口。它定义了一组规范，允许容器运行时（如 Docker、Podman 和 Containerd）与网络提供者（如 Flannel、Calico、Weave 等）进行交互，管理容器的网络配置。CNI 的主要目标是提供一个简单、可扩展的框架，以便在不同的环境中实现容器网络。

## CNI 插件

CNI 的初衷是创建一个框架，用于在配置或销毁容器时动态配置适当的网络配置和资源。插件负责为接口配置和管理 IP 地址，并且通常提供与 IP 管理、每个容器的 IP 分配、以及多主机连接相关的功能。容器运行时会调用网络插件，从而在容器启动时分配 IP 地址并配置网络，并在删除容器时再次调用它以清理这些资源。

运行时或协调器决定了容器应该加入哪个网络以及它需要调用哪个插件。然后，插件会将接口添加到容器网络命名空间中，作为一个 veth 对的一侧。接着，它会在主机上进行更改，包括将 veth 的其他部分连接到网桥。再之后，它会通过调用单独的 IPAM（IP地址管理）插件来分配 IP 地址并设置路由。

在 Kubernetes 中，kubelet 可以在适当的时间调用它找到的插件，为通过 kubelet 启动的 pod进行自动的网络配置。

Kubernetes 中可选的 CNI 插件如下：

- Flannel
- Calico
- Cilium
- Canal
- Weave

## 什么是 Calico？

Calico 是一种网络和安全解决方案，可让 Kubernetes 工作负载和非 Kubernetes/旧版工作负载无缝且安全地进行通信。

## 下载 Calico 配置文件（master节点）

Calico 官网：[https://docs.tigera.io/](https://docs.tigera.io/)

Calico的GitHub仓库地址：[https://github.com/projectcalico/calico](https://github.com/projectcalico/calico)

创建 calico 目录用于存放 tigera-operator.yaml、custom-resources.yaml 配置文件。

```shell
mkdir /usr/local/calico && cd /usr/local/calico
```

下载operator与custom-resource

::: code-group
```yaml [tigera-operator.yaml]
wget https://raw.githubusercontent.com/projectcalico/calico/v3.29.0/manifests/tigera-operator.yaml
```

```yaml [custom-resources.yaml]
wget https://raw.githubusercontent.com/projectcalico/calico/v3.29.0/manifests/custom-resources.yaml
```
:::

## 修改custom-resources.yaml

```yaml
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  # Configures Calico networking.
  calicoNetwork:
    ipPools:
    - name: default-ipv4-ippool
      blockSize: 26
      cidr: 10.97.0.0/16        # 修改为主节点配置pod网段一样，podSubnet: 10.97.0.0/16
      encapsulation: VXLANCrossSubnet
      natOutgoing: Enabled
      nodeSelector: all()

---

# This section configures the Calico API server.
# For more information, see: https://docs.tigera.io/calico/latest/reference/installation/api#operator.tigera.io/v1.APIServer
apiVersion: operator.tigera.io/v1
kind: APIServer
metadata:
  name: default
spec: {}
```

## 安装 Calico

部署 Tigera Operator，用于管理 Calico 网络插件的安装和配置。

```shell
kubectl create -f tigera-operator.yaml
```

查看 namespace 会发现 tigera-operator 的命名空间。

```shell
kubectl get ns

# 输出如下
default            Active   8m54s
kube-node-lease    Active   8m54s
kube-public        Active   8m54s
kube-system        Active   8m54s
tigera-operator    Active   24s
```

查看 tigera-operator 的 pod 的状态是否是 Running。

```shell
kubectl get pods -n tigera-operator

# 输出如下
NAME                              READY   STATUS    RESTARTS   AGE
tigera-operator-f8bc97d4c-hpxmz   1/1     Running   0          20s
```

tigera-operator 是 Running 状态才能继续后面的步骤，应用自定义资源定义，配置 Calico 网络插件的具体设置。

```shell
kubectl create -f custom-resources.yaml
```

## 查看 Calico 状态

- 查看 Calico 网络插件处于 **Running** 状态即表示安装成功。

```shell
kubectl get pod -n calico-system

# 输出如下
NAME                                      READY   STATUS    RESTARTS        AGE
calico-kube-controllers-987cb68fd-jww8s   1/1     Running   1 (7m23s ago)   25m
calico-node-2bjpp                         1/1     Running   1 (7m28s ago)   25m
calico-node-bsr9w                         1/1     Running   1 (7m23s ago)   25m
calico-node-xktdx                         1/1     Running   1 (7m34s ago)   13m
calico-typha-5499cd7446-jgvz6             1/1     Running   2 (7m33s ago)   13m
calico-typha-5499cd7446-rwncx             1/1     Running   1 (7m24s ago)   25m
csi-node-driver-hr9t8                     2/2     Running   2 (7m34s ago)   13m
csi-node-driver-nx9bj                     2/2     Running   2 (7m23s ago)   25m
csi-node-driver-v6tnb                     2/2     Running   2 (7m28s ago)   25m
```

- 查看节点状态处于 **Ready** 即表示安装成功

```shell
kubectl get nodes

# 输出如下
NAME                   STATUS   ROLES           AGE    VERSION
kubernetes-worker-01   Ready    <none>          87m    v1.31.3
kubernetes-worker-02   Ready    <none>          60m    v1.31.3
node                   Ready    control-plane   179m   v1.31.3
```