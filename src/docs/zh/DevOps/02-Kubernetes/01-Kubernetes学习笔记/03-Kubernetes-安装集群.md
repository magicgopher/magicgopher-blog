---
title: Kubernetes
author: MagicGopher
keywords: Kubernetes,Kubernetes学习笔记,Kubernetes应用实战,Kubernetes源码解析
---

# Kubernetes 安装集群

## 概述

kubeadm 是 kubernetes 的集群安装工具，能够快速安装 kubernetes 集群，安装 kubernetes 主要是安装它的各个镜像，而 kubeadm 已经为我们集成好了运行 kubernetes 所需的基本镜像。但由于国内的网络原因，在搭建环境时，无法拉取到这些镜像。此时我们只需要修改为阿里云提供的镜像服务即可解决该问题。

## 创建并修改配置

创建 cluster 目录，用于存放 `kubeadm-config.yaml` 配置文件。

```shell
mkdir -p /usr/local/kubernetes/cluster && cd /usr/local/kubernetes/cluster
```

导出 `kubeadm-config.yaml` 配置文件到 `/usr/local/kubernetes/cluster` 目录下。

```shell
kubeadm config print init-defaults --component-configs KubeProxyConfiguration,KubeletConfiguration > kubeadm-config.yaml
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
  # 这里修改成主节点 master-01 的 IP地址
  advertiseAddress: 192.168.56.100
  bindPort: 6443
nodeRegistration:
  # 这里修改成使用 cri-dockerd
  criSocket: unix:///var/run/cri-dockerd.sock
  imagePullPolicy: IfNotPresent
  imagePullSerial: true
  name: node
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
# 这里修改成对应的版本号（kubeadm是1.31.3-1.1版本的，这里就是1.31.3）
kubernetesVersion: 1.31.3
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
registry.aliyuncs.com/google_containers/kube-apiserver:v1.31.3
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.31.3
registry.aliyuncs.com/google_containers/kube-scheduler:v1.31.3
registry.aliyuncs.com/google_containers/kube-proxy:v1.31.3
registry.aliyuncs.com/google_containers/coredns:v1.11.3
registry.aliyuncs.com/google_containers/pause:3.10
registry.aliyuncs.com/google_containers/etcd:3.5.15-0
```

## 拉取所需镜像

```shell
kubeadm config images pull --config kubeadm-config.yaml

# 输出如下
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-apiserver:v1.31.3
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-controller-manager:v1.31.3
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-scheduler:v1.31.3
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-proxy:v1.31.3
[config/images] Pulled registry.aliyuncs.com/google_containers/coredns:v1.11.3
[config/images] Pulled registry.aliyuncs.com/google_containers/pause:3.10
[config/images] Pulled registry.aliyuncs.com/google_containers/etcd:3.5.15-0
```

## 安装 master 节点

执行以下命令初始化主节点，该命令指定了初始化时需要使用的配置文件，其中添加 --experimental-upload-certs 参数可以在后续执行加入节点时自动分发证书文件。追加的 tee kubeadm-init.log 用以输出日志【kubeadm init输出的日志信息会记录在kubeadm-init.log日志文件中】。

> **注意**：如果安装 kubernetes 版本和下载的镜像版本不统一则会出现 timed out waiting for the condition 错误。中途失败或是想修改配置可以使用 kubeadm reset 命令重置配置，再做初始化操作即可。

```shell
kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log

# 输出如下
[init] Using Kubernetes version: v1.31.3
[preflight] Running pre-flight checks
        [WARNING Hostname]: hostname "node" could not be reached
        [WARNING Hostname]: hostname "node": lookup node on 127.0.0.53:53: server misbehaving
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action beforehand using 'kubeadm config images pull'
W1129 05:31:01.830227    2781 checks.go:846] detected that the sandbox image "registry.k8s.io/pause:3.9" of the container runtime is inconsistent with that used by kubeadm.It is recommended to use "registry.aliyuncs.com/google_containers/pause:3.10" as the CRI sandbox image.
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local node] and IPs [10.96.0.1 192.168.56.100]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [localhost node] and IPs [192.168.56.100 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [localhost node] and IPs [192.168.56.100 127.0.0.1 ::1]
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
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests"
[kubelet-check] Waiting for a healthy kubelet at http://127.0.0.1:10248/healthz. This can take up to 4m0s
[kubelet-check] The kubelet is healthy after 1.001214919s
[api-check] Waiting for a healthy API server. This can take up to 4m0s
[api-check] The API server is healthy after 12.501387894s
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
1db3bdd34a61fb531cf9cceb8072ab292d4a54434fcd8768a668172afdf222c0
[mark-control-plane] Marking the node node as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node node as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
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

kubeadm join 192.168.56.100:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:426c9798aa6db32876d0d1a8983957b6cbd093fc35867904ec482c41c8a04235
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
NAME   STATUS     ROLES           AGE     VERSION
node   NotReady   control-plane   2m36s   v1.31.3
```

## 安装工作节点

将工作节点 Worker 加入到集群中很简单，只需要在 Node 服务器上安装 **kubeadm**、**kubectl**、**kubelet** 三个工具，然后使用 `kubeadm join` 命令加入即可，这个 `kubeadm join` 命令就是安装 master 节点的命令输出的内容，最后几行就有安装工作节点的 `kubeadm join` 命令内容。

```shell
# 这里需要加入--cri-socket 来指定使用 docker 还是 containerd
kubeadm join 192.168.56.100:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:426c9798aa6db32876d0d1a8983957b6cbd093fc35867904ec482c41c8a04235 \
        --cri-socket=unix:///var/run/cri-dockerd.sock

# 输出如下
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-check] Waiting for a healthy kubelet at http://127.0.0.1:10248/healthz. This can take up to 4m0s
[kubelet-check] The kubelet is healthy after 1.050735187s
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
NAME                   STATUS     ROLES           AGE     VERSION
kubernetes-worker-01   NotReady   <none>          21m     v1.31.3
kubernetes-worker-02   NotReady   <none>          8m50s   v1.31.3
node                   NotReady   control-plane   33m     v1.31.3
```

在 kubectl get nodes 的输出中，STATUS 显示为 NotReady 表示该节点尚未准备好处理 Pod，即使是 scheduler 的 状态为 Healthy 也不行。

简单的描述就是集群已经搭建成功，但是集群直接网络通信还是未配置。

## 查看 Pod 状态

```shell
kubectl get pod -n kube-system

# 输出如下
NAME                           READY   STATUS    RESTARTS        AGE
coredns-855c4dd65d-p26rk       0/1     Pending   0               35m
coredns-855c4dd65d-wlv69       0/1     Pending   0               35m
etcd-node                      1/1     Running   1 (7m34s ago)   35m
kube-apiserver-node            1/1     Running   1 (7m24s ago)   35m
kube-controller-manager-node   1/1     Running   1 (7m34s ago)   35m
kube-proxy-km5xt               1/1     Running   1 (7m50s ago)   10m
kube-proxy-sfg7b               1/1     Running   1 (7m35s ago)   35m
kube-proxy-txggf               1/1     Running   1 (7m41s ago)   23m
kube-scheduler-node            1/1     Running   1 (7m34s ago)   35m
```

由输出的结果可以看出 coredns 是没有在运行的，此时我们还需要安装网络插件。
