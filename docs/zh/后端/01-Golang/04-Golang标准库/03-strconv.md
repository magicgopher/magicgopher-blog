---
title: strconv
author: MagicGopher
keywords: strconv, strconv包
description: strconv标准库笔记
editLink: false
---

# strconv

## 简介

strconv 包实现了基本数据类型和其字符串表示之间的转换。它主要用于将字符串转换为基本数据类型，或将基本数据类型转换为字符串。

官方文档：[strconv package](https://pkg.go.dev/strconv)

## 字符串转整型

```go
// 参数s: 要转换的字符串（这里需要的是数值类型的字符串）
func Atoi(s string) (int, error)
```

将字符串 s 转为 int 类型

示例：

```go
// TestStringToInteger 整数类型字符串转为int类型
func TestStringToInteger(t *testing.T) {
	s1 := "12345"
	//s1 := "123.45" // 浮点数字符串
	result, err := strconv.Atoi(s1)
	if err != nil {
		log.Printf("转换失败: %v\n", err)
		return
	}
	t.Logf("类型: %T, 值: %v\n", result, result)
}
```

输出结果：

```text
=== RUN   TestStringToInteger
    strconv_test.go:18: 类型: int, 值: 12345
--- PASS: TestStringToInteger (0.00s)
PASS
```

## 整型转字符串

```go
// 参数i: 要转换成string类型的整数
func Itoa(i int) string
```

将整数 i 转为字符串类型

示例：

```go
// TestIntegerToString int类型转整数类型字符串
func TestIntegerToString(t *testing.T) {
	result := strconv.Itoa(78910)
	t.Logf("类型: %T, 值: %v\n", result, result)
}
```

输出结果：

```text
=== RUN   TestIntegerToString
    strconv_test.go:24: 类型: string, 值: 78910
--- PASS: TestIntegerToString (0.00s)
PASS
```

## 字符串转bool类型

```go
// 参数str: 要转换成bool类型的字符串
func ParseBool(str string) (bool, error)
```

将字符串 str 转为 bool 类型

示例：

```go
// TestStringToBool 字符串转bool类型
func TestStringToBool(t *testing.T) {
	// "1", "t", "T", "true", "TRUE", "True" // true
	// "0", "f", "F", "false", "FALSE", "False" // false
	result, err := strconv.ParseBool("true")
	//result, err := strconv.ParseBool("F")
	if err != nil {
		log.Printf("转换失败: %v\n", err)
		return
	}
	t.Logf("类型: %T, 值: %v\n", result, result)
}
```

输出结果：

```text
=== RUN   TestStringToBool
    strconv_test.go:37: 类型: bool, 值: true
--- PASS: TestStringToBool (0.00s)
PASS
```

## bool类型转字符串

```go
// 参数b: 要转换成string类型的bool类型
func FormatBool(b bool) string
```

将 bool 类型 b 转为字符串类型

示例：

```go
// TestBoolToString bool类型转字符串
func TestBoolToString(t *testing.T) {
	result := strconv.FormatBool(true)
	t.Logf("类型: %T, 值: %v\n", result, result)
}
```

输出结果：

```text
=== RUN   TestBoolToString
    strconv_test.go:43: 类型: string, 值: true
--- PASS: TestBoolToString (0.00s)
PASS
```

## 参考资料

- [https://go.dev](https://go.dev)
- [Golang中文学习文档站](https://golang.xiniushu.com)