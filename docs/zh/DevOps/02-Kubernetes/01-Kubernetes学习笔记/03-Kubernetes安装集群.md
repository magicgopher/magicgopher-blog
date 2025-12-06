---
title: Kubernetes安装集群
author: MagicGopher
keywords: Kubernetes, Kubernetes安装集群
description: 介绍 Kubernetes 安装集群过程
editLink: false
---

# Kubernetes安装集群

## 概述

kubeadm 是 kubernetes 的集群安装工具，能够快速安装 kubernetes 集群，安装 kubernetes 主要是安装它的各个镜像，而 kubeadm 已经为我们集成好了运行 kubernetes 所需的基本镜像。但由于国内的网络原因，在搭建环境时，无法拉取到这些镜像。此时我们只需要修改为阿里云提供的镜像服务即可解决该问题。

## 创建并修改配置

创建 cluster 目录，用于存放 `kubeadm-config.yaml` 配置文件。

```shell
mkdir -p /usr/local/kubernetes/cluster && cd /usr/local/kubernetes/cluster
```

导出 `kubeadm-config.yaml` 配置文件到 `/usr/local/kubernetes/cluster` 目录下。

```shell
kubeadm config print init-defaults > kubeadm-config.yaml
```

修改导出的 `kubeadm-config.yaml` 配置文件，需要修改以下有注释的地方。

```shell
apiVersion: kubeadm.k8s.io/v1beta4
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  # 这里修改成主节点 master 的 IP地址
  advertiseAddress: 192.168.52.100
  bindPort: 6443
nodeRegistration:
  # 这里修改成使用 cri-dockerd
  criSocket: unix:///var/run/cri-dockerd.sock
  imagePullPolicy: IfNotPresent
  imagePullSerial: true
  # 这里修改成主节点 master 的主机名
  name: kubernetes-master
  taints: null
timeouts:
  controlPlaneComponentHealthCheck: 4m0s
  discovery: 5m0s
  etcdAPICall: 2m0s
  kubeletHealthCheck: 4m0s
  kubernetesAPICall: 1m0s
  tlsBootstrap: 5m0s
  upgradeManifests: 5m0s
---
apiServer: {}
apiVersion: kubeadm.k8s.io/v1beta4
caCertificateValidityPeriod: 87600h0m0s
certificateValidityPeriod: 8760h0m0s
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns: {}
encryptionAlgorithm: RSA-2048
etcd:
  local:
    dataDir: /var/lib/etcd
# 国内不能访问 Google，修改为阿里云镜像源
imageRepository: registry.aliyuncs.com/google_containers
kind: ClusterConfiguration
# 这里修改成对应的版本号
kubernetesVersion: 1.34.2
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
  # 定义 Pod 网络的 CIDR 子网范围
  podSubnet: 10.97.0.0/16
proxy: {}
scheduler: {}
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

## 查看所需镜像

```shell
kubeadm config images list --config kubeadm-config.yaml

# 输出如下
registry.aliyuncs.com/google_containers/kube-apiserver:v1.34.2
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.34.2
registry.aliyuncs.com/google_containers/kube-scheduler:v1.34.2
registry.aliyuncs.com/google_containers/kube-proxy:v1.34.2
registry.aliyuncs.com/google_containers/coredns:v1.12.1
registry.aliyuncs.com/google_containers/pause:3.10.1
registry.aliyuncs.com/google_containers/etcd:3.6.5-0
```

## 拉取所需镜像

```shell
kubeadm config images pull --config kubeadm-config.yaml

# 输出如下
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-apiserver:v1.34.2
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-controller-manager:v1.34.2
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-scheduler:v1.34.2
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-proxy:v1.34.2
[config/images] Pulled registry.aliyuncs.com/google_containers/coredns:v1.12.1
[config/images] Pulled registry.aliyuncs.com/google_containers/pause:3.10.1
[config/images] Pulled registry.aliyuncs.com/google_containers/etcd:3.6.5-0
```

## 安装 master 节点

执行以下命令初始化主节点，该命令指定了初始化时需要使用的配置文件，其中添加 --experimental-upload-certs 参数可以在后续执行加入节点时自动分发证书文件。追加的 tee kubeadm-init.log 用以输出日志【kubeadm init输出的日志信息会记录在kubeadm-init.log日志文件中】。

> **注意**：如果安装 kubernetes 版本和下载的镜像版本不统一则会出现 timed out waiting for the condition 错误。中途失败或是想修改配置可以使用 kubeadm reset 命令重置配置，再做初始化操作即可。

```shell
kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log
```

出现以下错误：

```shell
[init] Using Kubernetes version: v1.34.2
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action beforehand using 'kubeadm config images pull'
W1206 00:44:34.586147    3036 checks.go:827] detected that the sandbox image "registry.k8s.io/pause:3.10" of the container runtime is inconsistent with that used by kubeadm. It is recommended to use "registry.aliyuncs.com/google_containers/pause:3.10.1" as the CRI sandbox image.
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubernetes kubernetes-master kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.52.100]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [kubernetes-master localhost] and IPs [192.168.52.100 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [kubernetes-master localhost] and IPs [192.168.52.100 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "super-admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/instance-config.yaml"
[patches] Applied patch of type "application/strategic-merge-patch+json" to target "kubeletconfiguration"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests"
[kubelet-check] Waiting for a healthy kubelet at http://127.0.0.1:10248/healthz. This can take up to 4m0s
[kubelet-check] The kubelet is healthy after 502.265919ms
[control-plane-check] Waiting for healthy control plane components. This can take up to 4m0s
[control-plane-check] Checking kube-apiserver at https://192.168.52.100:6443/livez
[control-plane-check] Checking kube-controller-manager at https://127.0.0.1:10257/healthz
[control-plane-check] Checking kube-scheduler at https://127.0.0.1:10259/livez
[control-plane-check] kube-apiserver is not healthy after 4m0.001976302s
[control-plane-check] kube-scheduler is not healthy after 4m0.002112041s
[control-plane-check] kube-controller-manager is not healthy after 4m0.002156153s

A control plane component may have crashed or exited when started by the container runtime.
To troubleshoot, list all containers using your preferred container runtimes CLI.
Here is one example how you may list all running Kubernetes containers by using crictl:
        - 'crictl --runtime-endpoint unix:///var/run/cri-dockerd.sock ps -a | grep kube | grep -v pause'
        Once you have found the failing container, you can inspect its logs with:
        - 'crictl --runtime-endpoint unix:///var/run/cri-dockerd.sock logs CONTAINERID'

error: error execution phase wait-control-plane: failed while waiting for the control plane to start: [kube-apiserver check failed at https://192.168.52.100:6443/livez: Get "https://192.168.52.100:6443/livez?timeout=10s": dial tcp 192.168.52.100:6443: connect: connection refused, kube-scheduler check failed at https://127.0.0.1:10259/livez: Get "https://127.0.0.1:10259/livez": dial tcp 127.0.0.1:10259: connect: connection refused, kube-controller-manager check failed at https://127.0.0.1:10257/healthz: Get "https://127.0.0.1:10257/healthz": dial tcp 127.0.0.1:10257: connect: connection refused]
To see the stack trace of this error execute with --v=5 or higher
```

问题分析：

- Sandbox 镜像不一致：kubeadm 根据你的配置希望使用阿里云的镜像，但是 cri-dockerd（你的容器运行时）默认配置使用的是 registry.k8s.io/pause:3.10。
- 网络问题：在中国大陆，registry.k8s.io 通常是无法访问的。因此，cri-dockerd 在尝试拉取 Sandbox 镜像（pause 容器）时会失败或超时，导致 Pod 无法创建，最终导致控制平面组件启动超时（Connection refused）。

修改 cri-dockerd 服务配置，告诉 cri-dockerd 使用阿里云的 pause 镜像，而不是默认的谷歌源。

::: warning 注意
注意：是所有的机器（包括：kubernetes-master、kubernetes-worker-01、kubernetes-worker-02）都有修改 `cri-docker.service` 配置里的 `ExecStart` 这一行，在命令末尾添加 --pod-infra-container-image 参数。
:::

查找并编辑 service 文件： 通常位于 `/usr/lib/systemd/system/cri-docker.service` 或 `/etc/systemd/system/cri-docker.service`。

```shell
# 如果没有找到，尝试 systemctl status cri-docker 查看 Loaded 行的文件路径
vim /usr/lib/systemd/system/cri-docker.service
```

修改 ExecStart 配置： 找到 ExecStart= 这一行，在命令末尾添加 --pod-infra-container-image 参数。

你需要指定阿里云的 pause 镜像地址[也就是查看所需镜像这里 pause 的镜像地址](#查看所需镜像)

```shell
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.10.1
```

::: warning 注意
注意：如果你的 ExecStart 后面已经有其他参数，请用空格隔开追加在后面。
:::

重载配置并重启 `cri-dockerd`。

```shell
# 重新加载配置文件
systemctl daemon-reload

# 重启 cri-docker
systemctl restart cri-docker
```

由于之前的初始化失败了，环境可能残留了脏数据，必须先重置。

```shell
kubeadm reset --cri-socket unix:///var/run/cri-dockerd.sock
# 输入 y 确认
```

清理残留文件（可选但推荐）：

```shell
rm -rf /etc/kubernetes/pki
rm -rf /etc/cni/net.d
rm -rf /var/lib/etcd
rm -rf $HOME/.kube/config
```

重新执行初始化：

```shell
kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log
```

```
# 输出如下
[init] Using Kubernetes version: v1.34.2
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubernetes kubernetes-master kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.52.100]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [kubernetes-master localhost] and IPs [192.168.52.100 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [kubernetes-master localhost] and IPs [192.168.52.100 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "super-admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/instance-config.yaml"
[patches] Applied patch of type "application/strategic-merge-patch+json" to target "kubeletconfiguration"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests"
[kubelet-check] Waiting for a healthy kubelet at http://127.0.0.1:10248/healthz. This can take up to 4m0s
[kubelet-check] The kubelet is healthy after 1.001013424s
[control-plane-check] Waiting for healthy control plane components. This can take up to 4m0s
[control-plane-check] Checking kube-apiserver at https://192.168.52.100:6443/livez
[control-plane-check] Checking kube-controller-manager at https://127.0.0.1:10257/healthz
[control-plane-check] Checking kube-scheduler at https://127.0.0.1:10259/livez
[control-plane-check] kube-controller-manager is healthy after 3.394831157s
[control-plane-check] kube-scheduler is healthy after 4.509543118s
[control-plane-check] kube-apiserver is healthy after 6.001823157s
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
0f192561ef8eed55a153cb308bd00351a10d54b09bfe5f056a2c797b0adb129f
[mark-control-plane] Marking the node kubernetes-master as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node kubernetes-master as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: abcdef.0123456789abcdef
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.52.100:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:2bfa2834d35fc395136fcc30f160f448d922e59084ee74779bb6aa53552956b3
```

## 配置 kubelet

在 master 节点上执行以下操作：

```shell
# 创建 .kube 目录，用于存储 Kubernetes 配置文件
mkdir -p $HOME/.kube

# 复制 admin.conf 文件到 .kube 目录，作为 kubectl 的配置文件
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

# 更改配置文件的所有者为当前用户，以确保读写权限
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## 验证 master 节点是否安装成功

```shell
kubectl get nodes

# 输出如下
NAME                STATUS     ROLES           AGE     VERSION
kubernetes-master   NotReady   control-plane   2m56s   v1.34.2
```

## 安装工作节点

将工作节点 Worker 加入到集群中很简单，只需要在 Node 服务器上安装 **kubeadm**、**kubectl**、**kubelet** 三个工具，然后使用 `kubeadm join` 命令加入即可，这个 `kubeadm join` 命令就是安装 master 节点的命令输出的内容，最后几行就有安装工作节点的 `kubeadm join` 命令内容。

```shell
# 这里需要加入--cri-socket 来指定使用 docker 还是 containerd
kubeadm join 192.168.52.100:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:2bfa2834d35fc395136fcc30f160f448d922e59084ee74779bb6aa53552956b3 \
        --cri-socket=unix:///var/run/cri-dockerd.sock


# 输出如下
[preflight] Running pre-flight checks
[preflight] Reading configuration from the "kubeadm-config" ConfigMap in namespace "kube-system"...
[preflight] Use 'kubeadm init phase upload-config kubeadm --config your-config-file' to re-upload it.
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/instance-config.yaml"
[patches] Applied patch of type "application/strategic-merge-patch+json" to target "kubeletconfiguration"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-check] Waiting for a healthy kubelet at http://127.0.0.1:10248/healthz. This can take up to 4m0s
[kubelet-check] The kubelet is healthy after 1.000919998s
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

## 验证工作节点是否加入集群

回到 master 节点查看是否安装成功。

```shell
kubectl get nodes

# 输出如下
NAME                   STATUS     ROLES           AGE    VERSION
kubernetes-master      NotReady   control-plane   30m    v1.34.2
kubernetes-worker-01   NotReady   <none>          13m    v1.34.2
kubernetes-worker-02   NotReady   <none>          114s   v1.34.2
```

在 kubectl get nodes 的输出中，STATUS 显示为 NotReady 表示该节点尚未准备好处理 Pod，即使是 scheduler 的 状态为 Healthy 也不行。

简单的描述就是集群已经搭建成功，但是集群直接网络通信还是未配置。

## 查看 Namespace

```shell
kubectl get namespaces

# 输出如下
NAME              STATUS   AGE
default           Active   31m
kube-node-lease   Active   31m
kube-public       Active   31m
kube-system       Active   31m
```

以上这些命名空间（namespace）是 Kubernetes 集群中常见的默认命名空间，它们有各自的作用：

- **default**：这是 Kubernetes 中默认的命名空间，如果你没有指定命名空间，资源（如 Pod、Service、Deployment 等）会被创建在这个命名空间下。
- **kube-node-lease**：该命名空间用于管理节点的租约（node lease）。Kubernetes 使用租约机制来跟踪节点的健康状况，以便在节点失效时及时发现和处理。该命名空间主要由 Kubernetes 控制平面使用，用户通常不会直接与之交互。
- **kube-public**：这是一个用于公开的命名空间，通常用于存储集群中的公开资源。这些资源可以被集群外部的任何人访问。比如，你可能会在这个命名空间中看到一些集群级别的配置和权限控制，供集群外部使用。
- **kube-system**：这是 Kubernetes 集群内部使用的命名空间，用于存放 Kubernetes 系统组件的资源，如 kube-apiserver、kube-scheduler、kube-controller-manager、CoreDNS 等。这些资源是集群运行所必需的，通常不需要修改或删除。

## 查看 Pod 状态

- 查看所有在 `kube-system` 命名空间中的 Pod 通常包括 Kubernetes 系统组件如 kube-apiserver、kube-controller-manager、kube-scheduler、CoreDNS 等。这些 Pod 对于集群的运行。

```shell
kubectl get pods -n kube-system

# 输出如下
NAME                                        READY   STATUS    RESTARTS   AGE
coredns-7cc97dffdd-t6bzh                    0/1     Pending   0          31m
coredns-7cc97dffdd-xm9cz                    0/1     Pending   0          31m
etcd-kubernetes-master                      1/1     Running   0          31m
kube-apiserver-kubernetes-master            1/1     Running   0          31m
kube-controller-manager-kubernetes-master   1/1     Running   0          31m
kube-proxy-7t9pt                            1/1     Running   0          31m
kube-proxy-mrc5p                            1/1     Running   0          14m
kube-proxy-t8prj                            1/1     Running   0          2m44s
kube-scheduler-kubernetes-master            1/1     Running   0          31m
```

由输出的结果可以看出 coredns 是没有在运行的，此时我们还需要安装网络插件。

## 参考资料

- [https://kubernetes.io](https://kubernetes.io)