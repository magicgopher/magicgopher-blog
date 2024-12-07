# Map

## Map的定义

map是 Go 语言的内置类型，它将一个值与一个键关联起来。可以使用相应的键检索值。

map是一种无序的键值对的集合。map最重要的一点是通过 `key` 来快速检索数据，`key` 类似于索引，指向数据的值。

map是一种集合，所以我们可以像迭代数组和切片那样迭代它。map是无序的，我们无法决定它的返回顺序，这是因为map是使用 `hash` 表来实现的，也是引用类型。

*语法格式*：

::: code-group
```go [声明map变量]
var 变量名 map[键类型]值类型
```

```go [初始化map变量]
变量名 = make(map[键类型]值类型)
```

```go [字面量初始化map变量]
变量名 := map[键类型]值类型{
    key1: value1,
    key2: value2,
    ...,
}
```
:::

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义一个map
	var m1 map[int]string
	fmt.Printf("m的类型:%T\n", m1)
	fmt.Printf("m是否为nil:%t\n", m1 == nil) // true
}
```

```go [示例2]
package main

import (
	"fmt"
)

func main() {
	// make函数创建map
	m1 := make(map[int]string)
	fmt.Printf("m的类型:%T\n", m1)
	fmt.Printf("m是否为nil:%t\n", m1 == nil) // false

	m2 := make(map[string]int, 10)
	fmt.Printf("m2的类型:%T\n", m2)
	fmt.Printf("m2是否为nil:%t\n", m2 == nil) // false
}
```
:::

## 添加键值对

*语法格式*：

```go
变量名[键类型] = 值类型
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 创建map
	m1 := map[string]string{
		"name":    "MagicGopher",
		"age":     "18",
		"address": "银河系地球",
	}
	// map可以通过len函数获取map的长度
	fmt.Printf("m1的长度:%d\n", len(m1))
	// map是无法通过cap函数获取map的容量的
	// fmt.Printf("m1的容量:%d\n", cap(m1))
	// map的值
	fmt.Printf("m1的值:%v\n", m1)
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 创建map
	m1 := make(map[string]string)
	m1["name"] = "MagicGopher"
	m1["age"] = "18"
	m1["address"] = "银河系地球"
	// map可以通过len函数获取map的长度
	fmt.Printf("m1的长度:%d\n", len(m1))
	// map是无法通过cap函数获取map的容量的
	// fmt.Printf("m1的容量:%d\n", cap(m1))
	// map的值
	fmt.Printf("m1的值:%v\n", m1)
}
```
:::

## 通过键获取值

*语法格式*：

```go
变量名[键]
```

*示例*：

```go
package main

import "fmt"

func main() {
	// 创建map
	m1 := map[int]string{
		1: "java",
		2: "golang",
		3: "python",
		4: "c++",
		5: "rust",
	}
	// 通过键获取值
	fmt.Printf("m1[1] = %v\n", m1[3])
	// 获取不存在的键，返回值是数据类型的默认值
	fmt.Printf("m1[6] = %v\n", m1[6])
}
```

## 遍历map

可以通过 `for range` 遍历map，在遍历map时，键是只读的而值是可读写的。

*示例*：

```go
package main

import "fmt"

func main() {
	// 可以用 for range 获取 key-value 对，key 是只读的，value 是可读写的。
	// Go 语言中 map 的 key 是不能直接修改的。
	// 定义map
	m := map[string]int{"a": 1, "b": 2}
	fmt.Println("修改前的map:", m)
	// 遍历 map，修改 value
	for k, v := range m {
		fmt.Println("修改前:", k, v)
		m[k] = v * 2
		fmt.Println("修改后:", k, m[k])
	}
	fmt.Println("修改后的map:", m)
}
```

## map中移除元素

可以使用`delete()`函数移除map中的元素。

*语法格式*：

```go
delete(map变量, 要删除的键)
```

*示例*：

```go
package main

import "fmt"

func main() {
	// 使用delete删除键值对
	m := map[string]int{
		"a": 1,
		"b": 2,
		"c": 3,
	}
	// for range遍历map
	for k, v := range m {
		println(k, v)
	}
	// 删除键值对
	delete(m, "a")
	fmt.Println("============")
	// 再遍历map
	for k, v := range m {
		println(k, v)
	}
	// 追加元素
	m["test"] = 100
	fmt.Println("============")
	// 再遍历map
	for k, v := range m {
		println(k, v)
	}
}
```

## 判断键的值是否存在

可以使用 `map[key]` 的方式来尝试访问map中的某个键，如果该键存在，就会返回对应的值，如果该键不存在，就会返回该值类型的零值【默认值】。

*语法格式*：

```go
键对应的值, 结果 := map变量名[键值]
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义一个map
	myMap := map[int]string{
		1: "apple",
		2: "banana",
		3: "orange",
	}
	// 判断键的值是否存在
	value, ok := myMap[1]
	fmt.Printf("value:%v, ok:%v\n", value, ok)
	value, ok = myMap[4]
	fmt.Printf("value:%v, ok:%v\n", value, ok)
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 创建一个 map
	m := map[string]int{
		"苹果": 5,
		"香蕉": 3,
		"橙子": 7,
	}

	// 检查 "香蕉" 键是否存在
	value, ok := m["香蕉"]
	if ok {
		fmt.Printf("'香蕉' 的值是: %d\n", value)
	} else {
		fmt.Println("'香蕉' 键不存在于 map 中")
	}

	// 检查 "梨" 键是否存在
	value, ok = m["梨"]
	if ok {
		fmt.Printf("'梨' 的值是: %d\n", value)
	} else {
		fmt.Println("'梨' 键不存在于 map 中")
	}
}
```
:::

## 使用map的注意事项

::: warning map使用时的注意事项
- map是无序的，每次打印出来的map都会不一样，它不能通过index获取，而必须通过key获取。
- map的长度是不固定的，也就是和slice一样，也是一种引用类型。
- 内置的len函数同样适用于map，返回map拥有的key的数量。
- map的key可以是所有可比较的类型，如布尔型、整数型、浮点型、复杂型、字符串型...也可以键。
  :::