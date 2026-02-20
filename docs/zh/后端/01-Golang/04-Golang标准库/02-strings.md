---
title: strings
author: MagicGopher
keywords: strings, strings包
description: strings标准库笔记
editLink: false
---

# strings

## 简介

strings 包实现了用于操作 UTF-8 编码字符串的简单函数。

官方文档：[strings package](https://pkg.go.dev/strings)

::: tip 提示
Go天然支持UTF8字符，所有的字符串操作都是建立在UTF8的基础之上。
:::

## 复制字符串

```go
// 参数 s：要复制的字符串
// 返回值：复制后的字符串副本
func Clone(s string) string
```

将会分配一个新的内存给复制的副本，如果传入一个空字符串，则不会分配内存且返回空字符串。

示例：

```go
// TestStringClone 复制字符串
func TestCloneString(t *testing.T) {
	src := "hello, world!"
	t.Logf("原来字符串的地址: %p, 字符串内容: %v\n", &src, src)
	cloneStr := strings.Clone(src)
	t.Logf("原来字符串的地址: %p, 字符串内容: %v\n", &cloneStr, cloneStr)
}
```

输出结果：

```text
=== RUN   TestStringClone
    strings_test.go:11: 原来字符串的地址: 0x14000112250, 字符串内容: hello, world!
    strings_test.go:13: 原来字符串的地址: 0x14000112290, 字符串内容: hello, world!
--- PASS: TestStringClone (0.00s)
PASS
```

## 比较字符串

```go
// 参数 a：要比较的字符串
// 参数 b：要比较的字符串
// 返回值：如果 a == b 返回 0；如果 a < b 返回 -1；如果 a > b 返回 1
func Compare(a, b string) int
```

将a与b按照字典顺序进行字符串比较，如果a>b，返回1，a<b返回-1，a=b返回0。

示例：

```go
// TestCompareString 比较字符串
func TestCompareString(t *testing.T) {
	s1 := "abc"
	s2 := "abc"
	s3 := "abe"
	s4 := "ab"
	f := func(s string) int {
		sum := 0
		for _, r := range s {
			sum += int(r)
		}
		return sum
	}
	i1 := f(s1)
	i2 := f(s2)
	t.Logf("s1码值: %v, s2码值: %v\n", i1, i2)
	t.Log(strings.Compare(s1, s2)) // 字符串1 == 字符串2（码值总和相等），结果: 0
	i3 := f(s3)
	t.Logf("s1码值: %v, s3码值: %v\n", i1, i3)
	t.Log(strings.Compare(s1, s3)) // 字符串1 < 字符串2 结果: -1
	i4 := f(s4)
	t.Logf("s1码值: %v, s4码值: %v\n", i1, i4)
	t.Log(strings.Compare(s1, s4)) // 字符串1 > 字符串2 结果: 1
}
```

输出结果：

```text
=== RUN   TestCompareString
    strings_test.go:31: s1码值: 294, s2码值: 294
    strings_test.go:32: 0
    strings_test.go:34: s1码值: 294, s3码值: 296
    strings_test.go:35: -1
    strings_test.go:37: s1码值: 294, s4码值: 195
    strings_test.go:38: 1
--- PASS: TestCompareString (0.00s)
PASS
```

## 包含字符串

```go
// 参数 s: 原始字符串
// 参数 substr: 要查找的子字符串
// 返回值: 如果 s 包含 substr 返回 true，否则返回 false
func Contains(s, substr string) bool
```

判断字符串 s 中是否包含子字符串 substr，如果包含返回true，否则返回false。

示例：

```go
// TestContainsString 包含字符串
func TestContainsString(t *testing.T) {
	s1 := "hdiosjdosajdoi"
	result1 := strings.Contains(s1, "sa")
	t.Logf("s1字符串是否包含: %s 字符串, 结果: %v\n", "sa", result1)
	result2 := strings.Contains(s1, "hello")
	t.Logf("s1字符串是否包含: %s 字符串, 结果: %v\n", "hello", result2)
	result3 := strings.Contains(s1, "sjdo")
	t.Logf("s1字符串是否包含: %s 字符串, 结果: %v\n", "sjdo", result3)
}
```

输出结果：
```text
=== RUN   TestContainsString
    strings_test.go:45: s1字符串是否包含: sa 字符串, 结果: true
    strings_test.go:47: s1字符串是否包含: hello 字符串, 结果: false
    strings_test.go:49: s1字符串是否包含: sjdo 字符串, 结果: true
--- PASS: TestContainsString (0.00s)
PASS
```

## 子字符串出现的次数

```go
// 参数 s: 原始字符串
// 参数 substr: 要查找的子字符串
// 返回值: substr 在 s 中出现的非重叠次数
func Count(s, substr string) int
```

返回字符串 s 中子字符串 substr 出现的次数。如果 substr 为空字符串，则返回字符串的 Unicode 字符个数（ rune 数） + 1。

示例：

```go
// TestCountSubString 子串出现次数
func TestCountSubString(t *testing.T) {
	s := "263817491469317401"
	t.Logf("字符串 s 中 1出现 %v 次\n", strings.Count(s, "1"))
	t.Logf("字符串 s 中 2出现 %v 次\n", strings.Count(s, "2"))
	t.Logf("字符串 s 中 99出现 %v 次\n", strings.Count(s, "99"))
}
```

输出结果：

```text
=== RUN   TestCountSubString
    strings_test.go:55: 字符串 s 中 1出现 4 次
    strings_test.go:56: 字符串 s 中 2出现 1 次
    strings_test.go:57: 字符串 s 中 99出现 0 次
--- PASS: TestCountSubString (0.00s)
PASS
```

## 删除指定子字符串

```go
// 参数 s: 原始字符串
// 参数 sep: 分隔符
// 返回值 before: sep 第一次出现之前的字符串
// 返回值 after: sep 第一次出现之后的字符串
// 返回值 found: 是否找到了 sep
func Cut(s, sep string) (before, after string, found bool)
```

删除在s内第一次出现的子串sep，并返回删除后的结果

- `before`: 被删除子串位置前面的字符串
- `after`: 被删除子串位置后面的字符串
- `found`: 是否找到子字符串

示例：

```go
// TestCutString 删除指定子字符串
func TestCutString(t *testing.T) {
	// 例子1：正常切分
	before, after, found := strings.Cut("hello,world", ",")
	fmt.Println(before, after, found) // 输出: hello world true
	// 例子2：切空格
	before, after, found = strings.Cut("Go is great", " ")
	fmt.Println(before, after, found) // 输出: Go is great true
	// 例子3：没找到分隔符
	before, after, found = strings.Cut("no-separator-here", ":")
	fmt.Println(before, after, found) // 输出: no-separator-here "" false
	// 例子4：分隔符在开头
	before, after, found = strings.Cut(":start", ":")
	fmt.Println(before, after, found) // 输出: "" start true
	// 例子5：分隔符在结尾
	before, after, found = strings.Cut("end:", ":")
	fmt.Println(before, after, found) // 输出: end "" true
	// 例子6：多次出现，只切第一个
	before, after, found = strings.Cut("a-b-c-d", "-")
	fmt.Println(before, after, found) // 输出: a b-c-d true
}
```

输出结果：
```text
=== RUN   TestCutString
hello world true
Go is great true
no-separator-here  false
 start true
end  true
a b-c-d true
--- PASS: TestCutString (0.00s)
PASS
```

## 判断两个字符串是否相等

```go
// 参数 s: 字符串1
// 参数 t: 字符串2
// 返回值: 如果两个字符串在 Unicode 大小写折叠下相等，则返回 true
func EqualFold(s, t string) bool
```

用于大小写不敏感的字符串相等性比较。

示例：

```go
// TestEqualFold 判断两个字符串内容（忽略大小写）
func TestEqualFold(t *testing.T) {
	s1 := "hello"
	s2 := "hello"
	fold1 := strings.EqualFold(s1, s2)
	t.Logf("%s 字符串和 %s 字符串是否相等, 结果: %v\n", s1, s2, fold1)
	s3 := "Hello"
	fold2 := strings.EqualFold(s1, s3)
	t.Logf("%s 字符串和 %s 字符串是否相等, 结果: %v\n", s1, s3, fold2)
	s4 := "world"
	fold3 := strings.EqualFold(s1, s4)
	t.Logf("%s 字符串和 %s 字符串是否相等, 结果: %v\n", s1, s4, fold3)
}
```

输出结果：

```text
=== RUN   TestEqualFold
    strings_test.go:88: hello 字符串和 hello 字符串是否相等, 结果: true
    strings_test.go:91: hello 字符串和 Hello 字符串是否相等, 结果: true
    strings_test.go:94: hello 字符串和 world 字符串是否相等, 结果: false
--- PASS: TestEqualFold (0.00s)
PASS
```

## 分割字符串

```go
// 参数 s: 要分割的字符串
// 返回值: 分割后的字符串切片
func Fields(s string) []string
```

返回将字符串 s 按照空白字符（如空格、换行符等，由 unicode.IsSpace 定义）分割成的子串切片。

```go
// 参数 s: 要分割的字符串
// 参数 f: 分割函数
func FieldsFunc(s string, f func(rune) bool) []string
```

类似 Fields，但依据函数 f 的返回值来分割。如果 f(c) 返回 true，则该字符 c 被视为分隔符。

示例：

```go
// TestField 字符串分割
func TestField(t *testing.T) {
	t.Logf("%q\n", strings.Fields(" a b c d e f g "))
	t.Logf("%q\n", strings.FieldsFunc("a,b,c,d,e,f,g", func(r rune) bool {
		return r == ','
	}))
}
```

输出结果：

```text
=== RUN   TestField
    strings_test.go:99: ["a" "b" "c" "d" "e" "f" "g"]
    strings_test.go:100: ["a" "b" "c" "d" "e" "f" "g"]
--- PASS: TestField (0.00s)
PASS
```

## 寻找前后缀

```go
// 参数 s: 原始字符串
// 参数 prefix: 前缀
// 返回值: 是否包含
func HasPrefix(s, prefix string) bool
```

判断 s 字符串是否以 prefix 开头。

```go
// 参数 s: 原始字符串
// 参数 suffix: 后缀
func HasSuffix(s, suffix string) bool
```

判断 s 字符串是否以 suffix 结尾。

示例：

```go
// TestPreSuffix 寻找前、后缀
func TestPreSuffix(t *testing.T) {
	str := "abbc cbba"
	fmt.Println(strings.HasPrefix(str, "abb"))
	fmt.Println(strings.HasSuffix(str, "bba"))
}
```

输出结果：

```text
=== RUN   TestPreSuffix
true
true
--- PASS: TestPreSuffix (0.00s)
PASS
```

## 子串的位置

```go
// 参数 s: 原始字符串
// 参数 substr: 要查找的子字符串
// 返回值: substr 在 s 中第一次出现的字节索引，未找到返回 -1
func Index(s, substr string) int
```

用于在字符串 s 中查找子串 substr 第一次出现的索引位置。若找到，返回以字节为单位的索引（从0开始）；若不存在，则返回 -1。

```go
// 参数 s: 原始字符串
// 参数 chars: 包含要查找的字符集合的字符串
// 返回值: s 中第一次出现 chars 中任意字符的字节索引，未找到返回 -1
func IndexAny(s, chars string) int
```

返回字符串 s 中包含 chars 中任意 Unicode 代码点的第一个实例的字节索引。若未找到，则返回 -1。

```go
// 参数 s: 原始字符串
// 参数 r: 要查找的 Unicode 码点（字符）
// 返回值: r 在 s 中第一次出现的字节索引，未找到返回 -1
func IndexRune(s string, r rune) int
```

用于在字符串中查找特定的 Unicode 码点（rune），它返回字符 r 在 s 中第一次出现的字节位置索引，若未找到则返回 -1。

示例：

```go
// TestIndexString 查找子串的位置
func TestIndexString(t *testing.T) {
	// 中文字符通常占用 3 个字节、emoji 通常占 4 字节
	s := "hello 你好 world! 😊 123"
	// Index: 查找完整的一段字符串（子串）
	t.Log(strings.Index(s, "你好"))     // 6
	t.Log(strings.Index(s, "你好 123")) // 没有找到，结果: -1
	t.Log(strings.Index(s, "l"))      // 2
	t.Log("==================")
	// IndexAny: 找一组字符中的任意一个
	t.Log(strings.IndexAny(s, "你好"))      // 6
	t.Log(strings.IndexAny(s, "好 world")) // 2
	t.Log(strings.IndexAny(s, "你"))       // 6
	t.Log("==================")
	// IndexRune：精确找单个 rune
	t.Log(strings.IndexRune(s, '你')) // 6     （'你' 的起始字节位置）
	t.Log(strings.IndexRune(s, '好')) // 9     （'好' 的字节位置）
	t.Log(strings.IndexRune(s, '😊')) // 20    （emoji 通常占 4 字节）
	t.Log(strings.IndexRune(s, 'z')) // -1
}
```

输出结果：

```text
=== RUN   TestIndexString
    strings_test.go:117: 6
    strings_test.go:118: -1
    strings_test.go:119: 2
    strings_test.go:120: ==================
    strings_test.go:122: 6
    strings_test.go:123: 2
    strings_test.go:124: 6
    strings_test.go:125: ==================
    strings_test.go:127: 6
    strings_test.go:128: 9
    strings_test.go:129: 20
    strings_test.go:130: -1
--- PASS: TestIndexString (0.00s)
PASS
```

## 遍历替换字符串

```go
// 参数 mapping: 映射函数，输入一个 rune，返回一个新的 rune。如果返回负数，则删除该字符。
// 参数 s: 需要被处理的源字符串
// 返回值: 映射转换后的新字符串
func Map(mapping func(rune) rune, s string) string
```

对字符串中的每一个 Unicode 字符（rune）应用一个自定义的转换函数，然后生成一个新的字符串。

示例：

```go
// TestMap 遍历替换字符串
func TestMap(t *testing.T) {
	s1 := "abc"
	// 大小写替换
	result1 := strings.Map(func(r rune) rune {
		return r - 32
	}, s1)
	t.Log(result1)
	// 删除某些字符串
	s2 := "Order #12345 - Total: $99.99"
	result2 := strings.Map(func(r rune) rune {
		// 判断是否是数字字符
		if r >= '0' && r <= '9' {
			return -1
		}
		return r
	}, s2)
	t.Log(result2)
	// 替换特定的字符
	s3 := "123$456#789%987#654$321"
	result3 := strings.Map(func(r rune) rune {
		if r == '$' || r == '#' || r == '%' {
			r = '-'
		}
		return r
	}, s3)
	t.Log(result3)
	//
	s4 := "Hello, 世界! 2026 Go😊"
	result4 := strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || r == ' ' {
			return r
		}
		return -1
	}, s4)
	t.Log(result4)
	// 处理中文、emoji 等 Unicode 字符
	s5 := "你好，世界！😊"
	result5 := strings.Map(func(r rune) rune {
		if r == '你' {
			return '我'
		}
		if r == '😊' {
			return '👍'
		}
		return r
	}, s5)
	t.Log(result5)
}
```

输出结果：

```text
=== RUN   TestMap
    strings_test.go:140: ABC
    strings_test.go:150: Order # - Total: $.
    strings_test.go:159: 123-456-789-987-654-321
    strings_test.go:168: Hello   Go
    strings_test.go:180: 我好，世界！👍
--- PASS: TestMap (0.00s)
PASS
```

## 重复复制字符串

```go
// 参数 s: 需要被处理的源字符串
// 参数 count: 重复次数
// 返回值: 重复拼接后的字符串
func Repeat(s string, count int) string
```

示例：

```go
// TestRepeatString 重复拼接一个字符串
func TestRepeatString(t *testing.T) {
	result1 := strings.Repeat("abc", 3) // 将abc字符串复制三次，然后拼接再一起
	t.Log(result1)
	result2 := strings.Repeat("你好", 2) // 将你好字符复制两次，然后拼接再一起
	t.Log(result2)
}
```

输出结果：

```text
=== RUN   TestRepeatString
    strings_test.go:186: abcabcabc
    strings_test.go:188: 你好你好
--- PASS: TestRepeatString (0.00s)
PASS
```

## 替换字符串

```go
// 参数 s: 原始字符串
// 参数 old: 要被替换的子字符串
// 参数 new: 替换成的新字符串
// 参数 n: 替换次数（<0 表示全部替换，0 表示不替换）
// 返回值: 替换后的字符串
func Replace(s, old, new string, n int) string
```

```go
// 等价于 stings.Replace(s, old, new, -1)
func ReplaceAll(s, old, new string) string
```

示例：

```go
func TestReplaceString(t *testing.T) {
	// n：表示替换次数，-1表示全部替换，0表示不替换
	s1 := "Hello, Java."
	replace1 := strings.Replace(s1, "Java", "Golang", 1)
	t.Log(replace1)
	s2 := "C++ C++ C++"
	replace2 := strings.Replace(s2, "C++", "Python", 2)
	t.Log(replace2)
	replace3 := strings.Replace(s2, "C++", "Python", -1)
	t.Log(replace3)
	replace4 := strings.Replace(s2, "C++", "Python", 0)
	t.Log(replace4)
	replace5 := strings.ReplaceAll(s2, "C++", "Golang")
	t.Log(replace5)
}
```

输出结果：

```text
=== RUN   TestReplaceString
    strings_test.go:196: Hello, Golang.
    strings_test.go:199: Python Python C++
    strings_test.go:201: Python Python Python
    strings_test.go:203: C++ C++ C++
    strings_test.go:205: Golang Golang Golang
--- PASS: TestReplaceString (0.00s)
PASS
```

## 分割字符串

```go
// 参数 s: 原始字符串
// 参数 sep: 分隔符
// 返回值: 分割后的字符串切片
func Split(s, sep string) []string
```

把字符串 s 按照 sep 进行分割字符串，返回一个字符串切片，子串中不包含分隔符 sep。

```go
// 参数 s: 原始字符串
// 参数 sep: 分隔符
// 参数 n: 限制返回的子串数量（-1 代表不限制，0 返回 nil）
// 返回值: 分割后的字符串切片
func SplitN(s, sep string, n int) []string
```

把字符串 s 按照 sep 进行分割，最多分割 n 次，返回一个字符串切片，子串中不包含分隔符 sep。

```go
// 参数 s: 原始字符串
// 参数 sep: 分隔符
// 返回值: 分割后的字符串切片
func SplitAfter(s, sep string) []string
```

把字符串 s 按照 sep 进行分割，返回一个字符串切片，且每个子串包含其后的分隔符。

```go
// 参数 s: 原始字符串
// 参数 sep: 分隔符
// 返回值: 一个迭代器 iter.Seq[string]
func SplitSeq(s, sep string) iter.Seq[string]
```

在 1.24 版本引入的新函数，利用迭代器的机制来高效地分割字符串（不含分隔符）。

```go
// 参数 s: 原始字符串
// 参数 sep: 分隔符
// 返回值: 一个迭代器 iter.Seq[string]
func SplitAfterSeq(s, sep string) iter.Seq[string]
```

类似 SplitSeq 利用迭代器的机制来高效地分割字符串，分割的字符串包含其后的分隔符。

示例：

```go
// TestSplitString 分割字符串
func TestSplitString(t *testing.T) {
	s1 := "123|456|789|987|654|321"
	result1 := strings.Split(s1, "|")
	t.Log(result1)
	s2 := "Java$Go$Python$C$Rust"
	// SplitN函数的n参数表示分割的次数
	// n>0 表示最多返回 n 个子串，第 n 个子串将包含剩余所有未分割的内容。
	// n<0 表示返回所有可能的子串，没有数量限制。
	// n=0 表示返回nil切片
	result2 := strings.SplitN(s2, "$", 2)
	t.Log(result2)
	s3 := "a,b,c,d,e,f"
	result3 := strings.SplitAfter(s3, ",")
	t.Log(result3)
	result4 := strings.SplitAfterN(s3, ",", 3)
	t.Log(result4)
	// SplitAfterSeq 函数是1.24引入的新函数
	// 旨在利用 Go 新加入的迭代器 (Iterator) 机制来高效地分割字符串
	for s := range strings.SplitAfterSeq(s3, ",") {
		t.Log(s)
	}
	for s := range strings.SplitSeq(s3, ",") {
		t.Log(s)
	}
}
```

输出结果：

```text
=== RUN   TestSplitString
    strings_test.go:212: [123 456 789 987 654 321]
    strings_test.go:219: [Java Go$Python$C$Rust]
    strings_test.go:222: [a, b, c, d, e, f]
    strings_test.go:224: [a, b, c,d,e,f]
    strings_test.go:228: a,
    strings_test.go:228: b,
    strings_test.go:228: c,
    strings_test.go:228: d,
    strings_test.go:228: e,
    strings_test.go:228: f
    strings_test.go:231: a
    strings_test.go:231: b
    strings_test.go:231: c
    strings_test.go:231: d
    strings_test.go:231: e
    strings_test.go:231: f
--- PASS: TestSplitString (0.00s)
PASS
```

## 大小写转换

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 返回值: 转换后的字符串
func ToLower(s string) string
```

将字符串 s 中的大写字母转换为小写字母。

```go
// 参数 c: 特殊大小写映射规则 (如 unicode.TurkishCase)
// 参数 s: 原始字符串（需要处理的字符串）
// 返回值: 转换后的字符串
func ToLowerSpecial(c unicode.SpecialCase, s string) string
```

根据传入的对应语言的unicode.SpecialCase ，转换成对应语言的小写字符串。

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 返回值: 转换后的字符串
func ToUpper(s string) string
```

将字符串 s 中的小写字母转换为大写字母。

```go
// 参数 c: 特殊大小写映射规则 (如 unicode.TurkishCase)
// 参数 s: 原始字符串（需要处理的字符串）
func ToUpperSpecial(c unicode.SpecialCase, s string) string
```

根据传入的对应语言的unicode.SpecialCase，转换成对应语言的大写字符串。

示例：

```go
// TestToLowerAndUpper 大小写转换
func TestToLowerAndUpper(t *testing.T) {
	t.Log(strings.ToLower("My Name is MagicGopher!"))
	t.Log(strings.ToLowerSpecial(unicode.TurkishCase, "Önnek İş"))
	t.Log(strings.ToUpper("My name is jack,Nice to meet you!"))
	t.Log(strings.ToUpperSpecial(unicode.TurkishCase, "örnek iş"))
}
```

输出结果：

```text
=== RUN   TestToLowerAndUpper
    strings_test.go:240: my name is magicgopher!
    strings_test.go:241: önnek iş
    strings_test.go:242: MY NAME IS JACK,NICE TO MEET YOU!
    strings_test.go:243: ÖRNEK İŞ
--- PASS: TestToLowerAndUpper (0.00s)
PASS
```

## 修剪字符串

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 参数 cutset: 剪切字符串
func Trim(s, cutset string) string
```

从字符串 s 的左侧和右侧移除 cutset 中的所有字符，返回一个新的字符串。

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 参数 cutset: 剪切字符串
func TrimLeft(s, cutset string) string
```

从字符串 s 的左侧移除 cutset 中的所有字符，返回一个新的字符串。

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 参数 cutset: 剪切字符串
func TrimRight(s, cutset string) string
```

从字符串 s 的右侧移除 cutset 中的所有字符，返回一个新的字符串。

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 参数 f: 过滤函数
// 返回值: 修剪后的字符串
func TrimFunc(s string, f func(rune) bool) string
```

从字符串 s 的左侧和右侧（从左右两侧向中间处理）移除满足过滤函数 f 的所有字符，返回一个新的字符串。

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 参数 prefix: 要移除的前缀字符串
// 返回值: 去除了前缀后的字符串
func TrimPrefix(s, prefix string) string
```

去除字符串 s 开头可能存在的指定前缀 prefix。如果 s 以 prefix 开头，则返回去除前缀后的字符串；否则，原样返回 s。它适用于清理或标准化以特定字符开头的字符串。

```go
// 参数 s: 原始字符串（需要处理的字符串）
// 参数 suffix: 要移除的后缀字符串
// 返回值: 去除了后缀后的字符串
func TrimSuffix(s, suffix string) string
```

去除字符串末尾指定的后缀。如果字符串 s 以 suffix 结尾，则返回去除后缀后的子串；否则返回原字符串 s。它只去除一次，不会循环去除。

```go
// 参数 s: 原始字符串（需要处理的字符串）
func TrimSpace(s string) string
```

去除字符串 s 中的所有空白，包括空格、制表符、换行符等。

示例：

```go
// TestTrimString 修剪字符串
func TestTrimString(t *testing.T) {
	s1 := "!!Hello, World!!!"
	result1 := strings.Trim(s1, "!")
	t.Log(result1)
	result2 := strings.TrimLeft(s1, "!")
	t.Log(result2)
	result3 := strings.TrimRight(s1, "!")
	t.Log(result3)
	result4 := strings.TrimFunc(s1, func(r rune) bool {
		return r == '!'
	})
	t.Log(result4)
	result5 := strings.TrimPrefix(s1, "!")
	t.Log(result5)
	result6 := strings.TrimSuffix(s1, "!")
	t.Log(result6)
	s2 := "  你好，Golang！  "
	result7 := strings.TrimSpace(s2)
	t.Log(result7)
}
```

输出结果：

```text
=== RUN   TestTrimString
    strings_test.go:250: Hello, World
    strings_test.go:252: Hello, World!!!
    strings_test.go:254: !!Hello, World
    strings_test.go:258: Hello, World
    strings_test.go:260: !Hello, World!!!
    strings_test.go:262: !!Hello, World!!
    strings_test.go:265: 你好，Golang！
--- PASS: TestTrimString (0.00s)
PASS
```

## 字符串Builder

```go
type Builder struct {
	// addr 指向字符串缓冲区的指针
	addr *Builder
	// buf 字符串缓冲区
	buf []byte
}
```

高效地、零拷贝或极少拷贝地构建（拼接）最终的字符串。

示例：

```go
// TestBuilderString Builder字符串
func TestBuilderString(t *testing.T) {
	s1 := "hello"
	t.Logf("地址: %p, 值: %v\n", &s1, s1)
	s2 := s1 + ",world!"
	t.Logf("地址: %p, 值: %v\n", &s2, s2)
	// 使用 strings 包的 Builder{} 结构体构建字符串
	sb := strings.Builder{}
	sb.WriteString("hello,")
	sb.Write([]byte("world!"))
	sb.WriteRune('+')
	sb.WriteByte(65)
	t.Log(sb.Len())
	t.Log(sb.String())
}
```

输出结果：

```text
=== RUN   TestBuilderString
    strings_test.go:271: 地址: 0x14000026360, 值: hello
    strings_test.go:273: 地址: 0x140000263a0, 值: hello,world!
    strings_test.go:280: 14
    strings_test.go:281: hello,world!+A
--- PASS: TestBuilderString (0.00s)
PASS
```

::: tip 提示
不要试图将 `Builder` 作为值进行传递，例如将 `strings.Builder` 作为函数参数传递的时候，程序会`panic`。

```go
strings: illegal use of non-zero Builder copied by value
```

其内部有如下一段代码：

```go
type Builder struct {
	addr *Builder //自身的地址
	buf  []byte
}

func (b *Builder) copyCheck() {
   if b.addr == nil {
      b.addr = (*Builder)(noescape(unsafe.Pointer(b)))
   } else if b.addr != b {
      panic("strings: illegal use of non-zero Builder copied by value")
   }
}
```

当对 `Builder` 进行值拷贝的同时，也拷贝了内部切片的指针，两个 `Builder` 在写入字符串的时候都是在对同一个切片进行操作，这也是为什么不允许被值拷贝的原因。

示例：

```go
// TestBuilderStringPain
func TestBuilderStringPain(t *testing.T) {
	var sb strings.Builder
	sb.WriteString("start")
	// 这里发生了值拷贝！
	//writeData(sb)
	writeDataP(&sb)
}

// 错误写法：接收的是 Builder 的值（副本）
func writeData(sb strings.Builder) {
	sb.WriteString(" added")
}

// 正确写法：接收的是 *strings.Builder（指针）
func writeDataP(sb *strings.Builder) {
	sb.WriteString(" added")
}
```
:::

## 字符串Replacer

```go
func NewReplacer(oldnew ...string) *Replacer
```

strings.Replacer 是 Go 语言中用于多组字符串批量替换的高效工具。

示例：

```go
// TestReplacer 字符替换
func TestReplacer(t *testing.T) {
	r := strings.NewReplacer(
		"<", "&lt;",
		">", "&gt;",
		"&", "&amp;",
	)
	// 进行替换
	input := "User <script> & code"
	result := r.Replace(input)
	t.Log(result)
}
```

输出结果：

```text
=== RUN   TestName
    strings_test.go:312: User &lt;script&gt; &amp; code
--- PASS: TestName (0.00s)
PASS
```

## 字符串Reader

```go
func NewReader(s string) *Reader
```

strings.Reader 的作用可以用一句话概括：它是将“字符串”伪装成“文件流”的适配器。

示例：

```go
// TestReader 字符串Reader
func TestReader(t *testing.T) {
	s := "Hello, world!"
	r := strings.NewReader(s)
	result, err := io.ReadAll(r)
	if err != nil {
		t.Fatal(err)
	}
	t.Log(string(result))
}
```

输出结果：

```text
=== RUN   TestReader
    strings_test.go:325: Hello, world!
--- PASS: TestReader (0.00s)
PASS
```

## 参考资料

- [https://go.dev](https://go.dev)
- [Golang中文学习文档站](https://golang.xiniushu.com)