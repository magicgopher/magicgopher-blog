# Gin学习笔记

## 简介

[Gin](https://github.com/gin-gonic/gin) 是一个用 [Go](https://go.dev/) 编写的 Web 框架。它具有类似 martini-like API，用于 [httprouter](https://github.com/julienschmidt/httprouter)，性能提高了 40 倍。如果您需要性能和良好的生产力，您一定会喜欢 Gin。

## 快速开始

### 前提条件

Go：三个最新主要[版本](https://go.dev/doc/devel/release)的任何一个（我们用这些版本进行测试）。

### 安装Gin

使用[Go Module](https://github.com/golang/go/wiki/Modules)支持，只需添加以下导入。

```
import "github.com/gin-gonic/gin"
```

