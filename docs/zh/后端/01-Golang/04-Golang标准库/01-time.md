---
title: time
author: MagicGopher
keywords: time, time包, 时间和日期
description: time标准库笔记
editLink: false
---

# time

## 简介

time 包提供了用于测量和显示时间的功能。所有日历计算均假定使用公历，且不考虑闰秒。

官方文档：[time package](https://pkg.go.dev/time)

## 当前本地时间

```go
func Now() Time // 获取当前本地时间（Local）
```

返回当前本地时间

示例：

```go
// TestTimeNow 获取当前系统时间（当前本地时间）
func TestTimeNow(t *testing.T) {
	now := time.Now() // 获取当前时间
	t.Log(now)
}
```

输出结果：

```text
=== RUN   TestTimeNow
    time_test.go:11: 2026-02-17 19:55:08.766962 +0800 CST m=+0.000695501
--- PASS: TestTimeNow (0.00s)
PASS
```

## 当前星期几

```go
func (t Time) Weekday() Weekday // 获取星期
```

获取当前星期几

示例：

```go
// TestTimeWeekday 获取当前星期几
func TestTimeWeekday(t *testing.T) {
    now := time.Now() // 获取当前时间
    t.Log(now.Weekday())
}
```

输出结果：

```text
=== RUN   TestTimeWeekday
}
```

## 获取年月日

```go
func (t Time) Year() int // 获取年份
func (t Time) Month() Month // 获取月份
func (t Time) Day() int // 获取日期
```

示例：

```go
// TestGetYearMonthDay 获取年月日
func TestGetYearMonthDay(t *testing.T) {
	now := time.Now()    // 获取本地时间，这里会返回一个 Time
	year := now.Year()   // 获取年份
	month := now.Month() // 获取月份
	day := now.Day()     // 获取日期
	t.Logf("%v 年 %v 月 %v 日", year, month, day)
}
```

输出结果：

```text
=== RUN   TestGetYear
    time_test.go:26: 2026 年 February 月 17 日
--- PASS: TestGetYear (0.00s)
PASS
```

## 获取时分秒

```go
func (t Time) Hour() int // 获取小时
func (t Time) Minute() int // 获取分钟
func (t Time) Second() int // 获取秒
```

示例：

```
// TestGetHourMinuteSecond 获取时分秒
func TestGetHourMinuteSecond(t *testing.T) {
	now := time.Now()      // 获取本地时间，这里会返回一个 Time
	hour := now.Hour()     // 获取当前小时
	minute := now.Minute() // 获取分钟
	second := now.Second() // 获取秒
	t.Logf("%v 时 %v 分 %v 秒\n", hour, minute, second)
}
```

输出结果：

```text
=== RUN   TestGetHourMinuteSecond
    time_test.go:35: 23 时 40 分 39 秒
--- PASS: TestGetHourMinuteSecond (0.00s)
PASS
```

## Time

```go
// year: 年份
// month: 月份
// day: 日期
// hour: 小时
// min: 分钟
// sec: 秒
// nsec: 纳秒
// loc: 时区
func Date(year int, month Month, day, hour, min, sec, nsec int, loc *Location) Time
```

根据指定的年、月、日、时、分、秒、纳秒和时区生成一个特定的 Time。如果 loc 为 nil，则使用 Local 作为时区。

示例：

```go
// TestGetTime 创建一个特定的Time实例
func TestGetTime(t *testing.T) {
	date := time.Date(2020, 2, 2, 10, 15, 45, 0, time.Local)
	t.Log(date)
}
```

输出结果：

```text
=== RUN   TestGetTime
    time_test.go:40: 2020-02-02 10:15:45 +0800 CST
--- PASS: TestGetTime (0.00s)
PASS
```

## 格式化时间

```go
// layout: 格式化字符串（格式为2006-01-02 15:04:05）
func (t Time) Format(layout string) string // 格式化时间
```

示例：

```go
// TestTimeFormat 将字符串格式时间解析为Time
func TestTimeFormat(t *testing.T) {
	timeStr1 := "2022-01-30 21:00:00"
	//timeStr1 := "Hello, World！"
	parse, err := time.Parse("2006-01-02 15:04:05", timeStr1)
	if err != nil {
		t.Fatalf("解析时间错误: %v\n", err)
	}
	t.Logf("解析后的时间: %v\n", parse)
}
```

输出结果：

```text
=== RUN   TestParseTime
    time_test.go:52: 解析后的时间: 2022-01-30 21:00:00 +0000 UTC
--- PASS: TestParseTime (0.00s)
PASS
```

## 增加一段时间间隔

```go
func (t Time) Add(d Duration) Time // 增加一段时间间隔
```

示例：

```go
// TestAddTime 增加或者减少时间
func TestAddTime(t *testing.T) {
	date1 := time.Date(2026, 2, 1, 10, 0, 0, 0, time.Local)
	resultTime1 := date1.Add(-3 * time.Hour) // date1时间减三小时
	t.Logf("%v 3小时前的时间是: %v\n", date1, resultTime1)
	resultTime2 := date1.Add(5*time.Hour + 25*time.Minute)
	t.Logf("%v 5小时25分后的时间是: %v\n", date1, resultTime2)
}
```

输出结果：

```text
=== RUN   TestAddTime
    time_test.go:66: 2026-02-01 10:00:00 +0800 CST 3小时前的时间是: 2026-02-01 07:00:00 +0800 CST
    time_test.go:68: 2026-02-01 10:00:00 +0800 CST 5小时25分后的时间是: 2026-02-01 15:25:00 +0800 CST
--- PASS: TestAddTime (0.00s)
PASS
```

## 两个时间的差值

```go
func (t Time) Sub(u Time) Duration
```

示例：

```go
// TestSubTime 两个时间的差值
func TestSubTime(t *testing.T) {
	t1 := time.Now()
	date1 := t1.Add(-3 * time.Hour) // 3小时前
	date2 := t1.Add(3 * time.Hour)  // 3小时后
	// “从过去到现在” → 现在.Sub(过去) → 正
	// “从现在到过去” → 过去.Sub(现在) → 负
	// “谁晚谁放前面，谁早谁放括号里”
	sub := date1.Sub(date2) // 从 date2 到 date1 过了多久？
	t.Log(sub)
}
```

输出结果：

```text
=== RUN   TestSubTime
    time_test.go:80: -6h0m0s
--- PASS: TestSubTime (0.00s)
PASS
```

## 判断两个时间是否相等

```go
func (t Time) Equal(u Time) bool
```

示例：

```go
// TestEqualTime 判断两个时间是否相等
func TestEqualTime(t *testing.T) {
	t1 := time.Date(2026, 2, 13, 20, 0, 0, 0, time.Local)
	t2 := time.Date(2026, 2, 13, 20, 0, 0, 0, time.Local)
	t3 := time.Date(2026, 2, 14, 20, 0, 0, 0, time.Local)
	t.Logf("t1 == t2, 结果: %v\n", t1.Equal(t2))
	t.Logf("t1 == t3, 结果: %v\n", t1.Equal(t3))
}
```

输出结果：

```text
=== RUN   TestEqualTime
    time_test.go:87: t1 == t2, 结果: true
    time_test.go:88: t1 == t3, 结果: false
--- PASS: TestEqualTime (0.00s)
PASS
```

## 获取时间戳

```go
func (t Time) Unix() int64 // 获取时间戳
func (t Time) UnixMilli() int64 // 获取毫秒时间戳
func (t Time) UnixMicro() int64 // 获取微秒时间戳
func (t Time) UnixNano() int64 // 获取纳秒时间戳
```

示例：

```go
// TestTimestamp 时间戳
func TestTimestamp(t *testing.T) {
	now := time.Now()
	t.Log(now.Unix())      // 时间戳（秒）
	t.Log(now.UnixNano())  // 时间戳（毫秒）
	t.Log(now.UnixMicro()) // 时间戳（微秒）
	t.Log(now.UnixMilli()) // 时间戳（纳秒）
}
```

输出结果：

```text
=== RUN   TestTimestamp
    time_test.go:95: 1771436051
    time_test.go:96: 1771436051562291000
    time_test.go:97: 1771436051562291
    time_test.go:98: 1771436051562
--- PASS: TestTimestamp (0.00s)
PASS
```

## 在时间之前/之后

```go
func (t Time) Before(u Time) bool
```

如果t代表的时间点在u之前，返回true；否则返回false。

```go
func (t Time) After(u Time) bool
```

如果t代表的时间点在u之后，返回true；否则返回false。

示例：

```go
// TestTimeBeforeAndAfter 在时间之前/之后
func TestTimeBeforeAndAfter(t *testing.T) {
	t1 := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)      // 元旦
	t2 := time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC)      // 儿童节
	t3 := time.Date(2025, 12, 31, 23, 59, 59, 0, time.UTC) // 跨年夜
	t.Log(t1.Before(t2))
	t.Log(t1.Before(t3))
	t.Log(t2.Before(t1))
	t.Log(t2.Before(t3))
	t.Log("=======")
	t.Log(t1.After(t2))
	t.Log(t1.After(t3))
	t.Log(t2.After(t1))
	t.Log(t2.After(t3))
}
```

输出结果：

```text
=== RUN   TestTimeBeforeAndAfter
    time_test.go:106: true
    time_test.go:107: true
    time_test.go:108: false
    time_test.go:109: true
    time_test.go:110: =======
    time_test.go:111: false
    time_test.go:112: false
    time_test.go:113: true
    time_test.go:114: false
--- PASS: TestTimeBeforeAndAfter (0.00s)
PASS
```

## 参考资料

- [https://go.dev](https://go.dev)