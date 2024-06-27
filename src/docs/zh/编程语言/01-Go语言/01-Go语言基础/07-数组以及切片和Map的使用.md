# 数组以及切片和Map的使用

## 数组

数组是一种存储相同数据类型的元素的定长容器，在 Go 语言中有一维数组和多维数组。

先介绍一维数组的语法格式和示例。

*语法格式*：

::: code-group
```go [定义数组]
var 数组名 [长度]数据类型
```

```go [定义并初始化1]
// 使用var关键字定义
var 数组名 [长度]数据类型 = [长度]数据类型{元素1, 元素2, 元素3, ..., 元素n}

// 使用类型推断的方式
var 数组名 = [长度]数据类型{元素1, 元素2, 元素3, ..., 元素n}

// 使用简短定义的方式
数组名 := [长度]数据类型{元素1, 元素2, 元素3, ..., 元素n}
```

```go [定义并初始化2]
var 数组名 [长度]数据类型 
数组名 = [长度]数据类型{元素1, 元素2, 元素3, ..., 元素n}
```
:::

*示例*：

```go
package main

import "fmt"

func main() {
	// 定义数组语法：var 数组名 [长度]数据类型
	var arr1 [5]int
	fmt.Printf("arr1 = %v\n", arr1) // [0 0 0 0 0]

	// 定义数组并初始化
	arr2 := [5]bool{true, false, true, false, true}
	fmt.Printf("arr2 = %v\n", arr2)

	// 定义数组并初始化
	var arr3 [5]string
	arr3 = [5]string{"a", "b", "c", "d", "e"}
	fmt.Printf("arr3 = %v\n", arr3)
}
```

### 访问数组元素

数组的每一个元素都可以通过下标索引的方式来访问。

*语法格式*：

```go [通过索引访问数组元素]
// 索引不存在，编译不通过
数组名[索引]
```

*示例*：

```go
package main

import "fmt"

func main() {
	// 创建一个int类型长度为6的数组
	var arr1 [5]int = [5]int{13, 25, 33, 46, 55}
	// 通过数组索引访问数组元素
	fmt.Println(arr1[0]) // 13
	fmt.Println(arr1[1]) // 25
	fmt.Println(arr1[2]) // 33
	fmt.Println(arr1[3]) // 46
	fmt.Println(arr1[4]) // 55

	// 访问不存在的索引
	// fmt.Println(arr1[5]) // 编译不通过
}
```

### 获取数组长度

索引的范围从0开始到数组的长度减1的位置结束，可以通过 `len()` 函数来获取数组的长度【数组中的元素个数】。

*语法格式*：

```go
// v可以是以下几种类型: array、slice、string、map、channel
len(v)
```

*示例*：

```go
package main

import "fmt"

func main() {
	// 使用len()函数获取数组长度
	var arr = [10]int{13, 23, 36, 44, 58, 64, 72, 88, 91}
	fmt.Printf("数组长度为：%d\n", len(arr)) // 数组长度为：10
}
```

### 数组的初始化元素默认值

在初始化数组时每一个元素的初始化都是数据类型的初始值，数值型: 0、字符串: ""、布尔类型: false、浮点类型: 0.0等。

*示例*：

```go
package main

import "fmt"

func main() {
	// int类型的数组
	var a1 [3]int
	fmt.Printf("a1 = %v\n", a1) // a1 = [0 0 0]

	// bool类型的数组
	var a2 [3]bool
	fmt.Printf("a2 = %v\n", a2) // a2 = [false false false]

	// string类型的数组
	var a3 [3]string
	fmt.Printf("a3 = %v\n", a3) // a3 = [   ]

	// float64类型的数组
	var a4 [3]float64
	fmt.Printf("a4 = %v\n", a4) // a4 = [0 0 0]
}
```

### 使用...替代数组长度

在定义数组并初始化数组元素时，可以使用 `...` 来替代数组的长度，`...` 表示数组的长度根据数组的元素个数来推断数组的长度。

*示例*：

```go
package main

import "fmt"

func main() {
	// 在定义数组并初始化数组元素时可以使用...来替代数组的长度
	var a = [...]int{1, 2, 3, 4, 5} // 定义数组并初始化数组元素
	fmt.Printf("a = %v\n", a)       // a = [1 2 3 4 5]
}
```

### 比较数组内元素是否相同

如果两个数组类型相同（长度相同、数据类型相同）的情况下，可以使用 `==` 或者 `!=` 的方式来判断两个数组是否相同，只有当两个数组的所有元素都是相等的时候数组才是相等的，不能比较两个类型不同的数组，否则程序将无法完成编译。

*示例*：

```go
package main

import "fmt"

func main() {
	// 使用==判断两个数组是否相同
	a1 := [...]int{1, 2, 3}
	a2 := [...]int{1, 2, 3}
	fmt.Printf("a1类型:%T\n", a1)
	fmt.Printf("a2类型:%T\n", a2)
	fmt.Printf("a1 == a2 结果:%t\n", (a1 == a2))
	// 使用==判断两个数组是否相同
	a3 := [...]int{11, 2, 3}
	fmt.Printf("a3类型:%T\n", a3)
	fmt.Printf("a1 == a3 结果:%t\n", (a1 == a3))
	// 使用!=判断两个数组是否不相同
	fmt.Printf("a1 != a2 结果:%t\n", (a1 != a2))
	fmt.Printf("a1 != a3 结果:%t\n", (a1 != a3))

	// 注意事项：必须是两个数组类型相同才能进行比较。【数据类型相同：长度相同、数据类型相同】
	// a4 := [...]int{1, 2, 3, 4}
	// fmt.Printf("a1 == a4 结果:%t\n", (a1 == a4)) // 编译不通过
}
```

### 遍历数组

可以使用 `for` 语句或者 `for range` 语句来对数组进行遍历操作。

示例：

```go
package main

import "fmt"

func main() {
	// 定义一个字符串数组长度为5
	s1 := [5]string{"Go", "Java", "C++", "Python", "Rust"}
	// 使用for循环遍历数组
	for i := 0; i < len(s1); i++ {
		println(s1[i])
	}
	fmt.Println("========================")
	// 使用for range遍历数组
	for index, value := range s1 {
		println(index, value)
	}
}
```

### 数组是值类型

在Go语言中数组是值类型，而不是引用类型，也就是当一个数组被赋值给另一个变量时，实际上是创建了一个新的数组，并将原来数组的值拷贝到了这个新数组中【值拷贝】，如果对新数组进行修改，原数组不会受影响。

*示例*：

```go
package main

import "fmt"

func main() {
	// 数组是值类型
	arr1 := [3]int{1, 2, 3}
	arr2 := arr1

	var arr3 [3]int
	arr3 = arr1
	// 打印arr1、arr2、arr3的内存地址和值
	fmt.Printf("arr1地址:%p,arr1值:%#v\n", &arr1, arr1)
	fmt.Printf("arr2地址:%p,arr2值:%#v\n", &arr2, arr2)
	fmt.Printf("arr3地址:%p,arr3值:%#v\n", &arr3, arr3)

	fmt.Println("=======================================")

	// 对arr2数组的第二个元素进行修改
	arr2[1] = 200
	// 对arr3数组的第三个元素进行修改
	arr3[2] = 300

	// 再打印arr1、arr2、arr3的内存地址和值
	fmt.Printf("arr1地址:%p,arr1值:%#v\n", &arr1, arr1)
	fmt.Printf("arr2地址:%p,arr2值:%#v\n", &arr2, arr2)
	fmt.Printf("arr3地址:%p,arr3值:%#v\n", &arr3, arr3)
}
```

### 长度也是数组类型组成部分

数组的长度也是数组类型的组成部分，因此 `[5]int` 和 `[6]int` 是两种不同的数组类型。

*示例*：

```go
package main

import "fmt"

func main() {
	// [5]int和[6]int是两种不同的数组类型
	a1 := [5]int{1, 2, 3, 4, 5}
	fmt.Printf("a1的值:%v\n", a1)
	// a1 = [6]int{1, 2, 3, 4, 5, 6} // 编译不通过
	a1 = [5]int{11, 22, 33, 44, 55}
	fmt.Printf("a1的值:%v\n", a1)
}
```

### 多维数组

在 Go 语言中，多维数组是由数组的数组组成的。最常见的多维数组是二维数组，但是你可以创建任意数量的维度。

多维数组主要用于场景，其中需要存储和操作表格数据或其他形式的网格，例如在矩阵运算或图形计算中。然而，当你需要一个动态大小的多维结构时，应该使用切片的切片。

*语法格式*：

```go
var 变量名 [长度1][长度2]...[长度n] 数据类型
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义一个[4][3]的二维数组。（多维数组同理）
    // 有4个一维数组，每个一维数组的长度都是3
	var array [4][3]int
	array = [4][3]int{
		{1, 2, 3},    // [0,0] [0,1] [0,2]
		{4, 5, 6},    // [1,0] [1,1] [1,2]
		{7, 8, 9},    // [2,0] [2,1] [2,2]
		{10, 11, 12}, // [3,0] [3,1] [3,2]
	}
	for i := 0; i < len(array); i++ {
		for j := 0; j < len(array[i]); j++ {
			fmt.Printf("arr[%d][%d]:%v\n", i, j, array[i][j])
		}
	}
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 定义一个三维数组
	var array3D [2][3][4]int
	// 给数组赋值
	// 2 表示这个三维数组有 2 个二维数组。
	// 3 表示每个二维数组有 3 个一维数组(行)。
	// 4 表示每个一维数组有 4 个元素(列)。
	// 个数计算：2 * 3 * 4 = 24
	array3D = [2][3][4]int{
		{
			{1, 2, 3, 4},
			{5, 6, 7, 8},
			{9, 10, 11, 12},
		},
		{
			{13, 14, 15, 16},
			{17, 18, 19, 20},
			{21, 22, 23, 24},
		},
	}
	fmt.Println(array3D)
}
```
:::

### 使用数组注意事项

::: warning 数组使用时的注意事项
- 固定大小：Go中的数组是固定大小的。数组的长度是其类型的一部分，一旦声明，数组的大小就不能改变。
- 值类型：Go中的数组是值类型，这意味着当它们被赋值给一个新变量或者作为参数传递给函数时，实际上会复制整个数组。如果数组比较大，这可能会导致性能问题。
- 初始化：你可以在声明数组时初始化数组元素。如果不初始化，默认情况下，数值数组元素将被初始化为0，字符串数组为空字符串，布尔数组元素为false。
- 索引：数组的索引从0开始，尝试访问超出数组长度范围的索引会产生运行时错误（out of range）。
- 多维数组：在 Go 中，可以创建多维数组。在使用时，你要为每个维度提供大小，并记住它们的索引也是从0开始的。
- 迭代：可以使用for循环或for...range结构来迭代数组。
- 内存布局：数组中的元素在内存中是连续存放的。

请记住，在需要动态大小集合的时候，应该使用切片（slice），而不是数组，因为切片比数组更加灵活。
:::

## 切片

切片是对数组的抽象，提供了更强大和灵活的数据结构。切片本身不存储任何数据，而是引用一个底层数组的一部分。

*语法格式*：

::: code-group
```go [方式一]
// 切片的[]是不能有长度的。
var 变量名 []数据类型
```

```go [方式二]
// 使用make内置函数创建切片
// 数据类型: Slice、Map、Channel
// 长度: 当前包含的元素个数
// 容量: 当前底层容纳的最大元素个数
make([]数据类型, 长度, 容量)

// 另一种写法
var 变量名 []数据类型 = make([]数据类型, 长度, 容量)
// 也可以简写
变量名 := make([]数据类型, 长度, 容量)
```
:::

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义一个int类型的切片
	var s1 []int
	fmt.Printf("s1的类型:%T\n", s1)

	// 使用make函数定义一个string类型的切片
	s2 := make([]string, 0, 3)
	fmt.Printf("s2的类型:%T\n", s2)
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 定义string类型切片
	// 此时的切片为空【栈内存已经分配好切片的指针、长度、容量】
	// 但是堆内存中还没有给切片分配任何存储空间
	var s1 []string // nil
	// 定义int类型切片
	// 这里原理同上【和s1切片同理】
	var s2 []int // nil
	// 定义一个int类型空切片
	s3 := []int{} // {}
	// 打印三个切片
	fmt.Println(s1, s2, s3) // [] [] []
	// 打印三个切片的长度
	fmt.Println(len(s1), len(s2), len(s3)) // 0 0 0
	// 切片判断为空
	fmt.Println(s1 == nil) // true
	fmt.Println(s2 == nil) // true
	fmt.Println(s3 == nil) // false
}
```

```go [示例3]
package main

import "fmt"

func main() {
	// make函数创建string类型切片
	// 使用 make 创建的切片都不可能是 nil
	s1 := make([]string, 0)
	fmt.Println(len(s1)) // 0
	// 判断make函数创建的切片是否为nil
	fmt.Println(s1 == nil)
}
```
:::

### 给切片添加元素

使用 `append()` 函数是用来向切片末尾追加元素。

*语法格式*：

```go
append(切片, 元素1, 元素2, 元素3, ..., 元素n)
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 使用make函数定义一个int类型切片，切片的长度为0，容量为5
	// 此时这个切片是空的，但是这个切片不是nil，空不等同于nil，不等同于nil
	// 空是说明容器是没有东西的，nil是这个容器不存在的
	s1 := make([]int, 0, 5)
	fmt.Println(s1) // 此时的切片是[]

	// 使用append函数向切片中添加元素
	s1 = append(s1, 1, 2, 3, 4)
	fmt.Println(s1) // [1 2 3 4]
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 使用append函数给切片末尾追加元素。
	// append函数只能在末尾追加元素，不能在中间【或者指定索引位置】插入元素。
	// 注意append函数会返回一个新切片，所以这里需要重新赋值给s1
	s1 := make([]int, 5, 10) // 这里初始化的切片前面5个元素是0，后面5个元素是nil
	fmt.Printf("s1类型:%T\n", s1)
	fmt.Printf("s1长度:%d,s1容量:%d\n", len(s1), cap(s1)) // len: 5, cap: 10
	fmt.Printf("s1:%v\n", s1)
	fmt.Println("=======================")
	fmt.Println("append()第一次")
	s1 = append(s1, 1, 2, 3, 4, 5) // 5个元素
	fmt.Printf("s1类型:%T\n", s1)
	fmt.Printf("s1长度:%d,s1容量:%d\n", len(s1), cap(s1))
	fmt.Printf("s1:%v\n", s1)
	fmt.Println("=======================")
	fmt.Println("append()第二次") // 第二次追加元素，发现容量不够，自动扩容
	s1 = append(s1, 6, 7, 8)   // 3个元素
	fmt.Printf("s1类型:%T\n", s1)
	fmt.Printf("s1长度:%d,s1容量:%d\n", len(s1), cap(s1)) // len: 13, cap: 20
	fmt.Printf("s1:%v\n", s1)
}
```
:::

### 将数组转成切片

*语法格式*：

```go
// 索引是左闭右开的【包含起始索引的元素直到结束索引的前一个元素，但不包含结束索引的元素】
// 所以切片的长度是结束索引减去起始索引。
var 变量名 = 数组[起始索引:结束索引]
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 将数组转成切片语法格式：数组名[起始索引:结束索引]
	// 定义一个int类型长度10的数组
	arr1 := [10]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	// 打印数组信息
	fmt.Printf("len:%d\n", len(arr1)) // len:10
	fmt.Printf("arr1:%T\n", arr1)     // arr1:[10]int

	// 将数组索引为2到5的元素转成切片
	// 这里2到5是左闭右开的等价于[2,5)表示一个开区间，其中包含2但不包含5
	// 长度等于结束索引减去起始索引，所以长度为3
	s1 := arr1[2:5]
	fmt.Printf("len:%d\n", len(s1)) // len:3
	fmt.Printf("s1:%T\n", s1)       // s1:[]int
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 将数组转成切片语法格式：数组名[起始索引:结束索引]
	// 创建一个int类型长度10的数组
	arr1 := [10]int{27, 86, 82, 48, 80, 83, 19, 68, 96, 79}
	fmt.Printf("arr1的类型:%T\n", arr1)
	fmt.Printf("arr1的长度:%d,容量:%d\n", len(arr1), cap(arr1))
	fmt.Printf("arr1的内容:%v\n", arr1)
	fmt.Println("=======================================")

	// 将数组转成切片,这里的[:]表示将数组的全部元素拷贝到切片中
	s1 := arr1[:]
	fmt.Printf("s1的类型:%T\n", s1)
	fmt.Printf("s1的长度:%d,容量:%d\n", len(s1), cap(s1))
	fmt.Printf("s1的内容:%v\n", s1)
	fmt.Println("=======================================")

	// 从:左边没有写就是从0开始拷贝元素,直到拷贝到:右边的索引为4位置,索引为5是不包含的.
	s2 := arr1[:5]
	fmt.Printf("s2的类型:%T\n", s2)
	fmt.Printf("s2的长度:%d,容量:%d\n", len(s2), cap(s2))
	fmt.Printf("s2的内容:%v\n", s2)
	fmt.Println("=======================================")

	// 从:右边没有写就是从索引为6位置开始拷贝元素,直到拷贝到数组的最后一个元素.
	s3 := arr1[6:]
	fmt.Printf("s3的类型:%T\n", s3)
	fmt.Printf("s3的长度:%d,容量:%d\n", len(s3), cap(s3))
	fmt.Printf("s3的内容:%v\n", s3)
}
```
:::

### 切片拷贝

使用 `copy()` 函数可以将一个数组切片的元素拷贝到另一个数组切片中。

*语法格式*：

```go
copy(目标切片, 源切片) // 返回拷贝的元素个数
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	s1 := []int{1, 2, 3, 4, 5}
	s2 := []int{6, 7, 8}
	// 拷贝之前
	fmt.Printf("s1:%v\n", s1) // [1 2 3 4 5]
	fmt.Printf("s1的长度:%d,s1的容量:%d\n", len(s1), cap(s1))
	fmt.Printf("s2:%v\n", s2) // [6 7 8]
	fmt.Printf("s2的长度:%d,s2的容量:%d\n", len(s2), cap(s2))
	// 将s1拷贝到s2
	copy(s2, s1)
	fmt.Printf("s1:%v\n", s1) // [1 2 3 4 5]
	fmt.Printf("s1的长度:%d,s1的容量:%d\n", len(s1), cap(s1))
	fmt.Printf("s2:%v\n", s2) // [1 2 3]
	fmt.Printf("s2的长度:%d,s2的容量:%d\n", len(s2), cap(s2))
}
```

```go [示例2]
package main

import "fmt"

func main() {
	s1 := []int{1, 2, 3, 4, 5}
	s2 := []int{6, 7, 8}
	// 拷贝之前
	fmt.Printf("s1:%v\n", s1) // [1 2 3 4 5]
	fmt.Printf("s1的长度:%d,s1的容量:%d\n", len(s1), cap(s1))
	fmt.Printf("s2:%v\n", s2) // [6 7 8]
	fmt.Printf("s2的长度:%d,s2的容量:%d\n", len(s2), cap(s2))
	// 将s2拷贝到s1
	copy(s1, s2)
	// 拷贝之后
	fmt.Printf("s1:%v\n", s1) // [6 7 8 4 5]
	fmt.Printf("s1的长度:%d,s1的容量:%d\n", len(s1), cap(s1))
	fmt.Printf("s2:%v\n", s2) // [6 7 8]
	fmt.Printf("s2的长度:%d,s2的容量:%d\n", len(s2), cap(s2))
}
```
:::

### 切片中移除元素

在 Go 语言中切片并没有删除元素的方法或者是接口，需要根据切片本身的特性，来删除切片中的元素。

首先介绍的是从开头位置移除[删除]切片中的元素。

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 直接移动数据指针的方式删除切片中的元素
	// 删除开头N个元素语法格式：切片名 = 切片名[N:]
	// 定义切片初始化5个元素
	s1 := []int{1, 2, 3, 4, 5}
	fmt.Println(s1) // [1 2 3 4 5]
	s1 = s1[1:]     // 删除第一个元素【从下标1开始截取到末尾】
	fmt.Println(s1) // [2 3 4 5]
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 定义切片
	s1 := []int{1, 2, 3, 4, 5}
	fmt.Println(s1) // [1 2 3 4 5]
	// 通过 append 函数将第一个元素之后的所有元素复制到一个新的切片中，覆盖原切片内容。
	s1 = append(s1[:0], s1[1:]...)
	fmt.Println(s1) // [2 3 4 5]
}
```
:::

从中间位置移除[删除]切片中的元素。

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义一个切片int类型
	s1 := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}
	fmt.Println(s1)
	// 移除值为10的元素
	s1 = append(s1[:9], s1[10:]...)
	fmt.Println(s1)
}
```
:::

从尾部位置移除[删除]切片中的元素。

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义切片
	s1 := []int{1, 2, 3, 4, 5}
	fmt.Println(s1)
	// 移除后面一个元素
	s1 = s1[:len(s1)-1]
	fmt.Println(s1)
	// 移除后面N个元素
	s1 = s1[:len(s1)-2]
	fmt.Println(s1)
}
```
:::

### 多维切片(了解)

多维切片与多维数组类似，但是多维切片的元素是切片，而不是数组。

*语法格式*：

```go
var 多维切片名 [][]...[] 数据类型
```

*示例*：

::: code-group
```go [示例1]
package main

import "fmt"

func main() {
	// 定义一个二维切片
	twoDimSlice := make([][]int, 3)

	// 为每个一维切片分配内存空间
	for i := range twoDimSlice {
		twoDimSlice[i] = make([]int, 4)
	}

	// 填充数据
	twoDimSlice[0] = []int{1, 2, 3, 4}
	twoDimSlice[1] = []int{5, 6, 7, 8}
	twoDimSlice[2] = []int{9, 10, 11, 12}

	// 访问元素
	fmt.Println(twoDimSlice[1][2]) // 输出: 7
}
```

```go [示例2]
package main

import "fmt"

func main() {
	// 定义一个三维切片
	threeDimSlice := make([][][]int, 2)

	// 为每个二维切片分配内存空间
	for i := range threeDimSlice {
		threeDimSlice[i] = make([][]int, 3)
		for j := range threeDimSlice[i] {
			threeDimSlice[i][j] = make([]int, 4)
		}
	}

	// 填充数据
	threeDimSlice[0][0] = []int{1, 2, 3, 4}
	threeDimSlice[0][1] = []int{5, 6, 7, 8}
	threeDimSlice[0][2] = []int{9, 10, 11, 12}
	threeDimSlice[1][0] = []int{13, 14, 15, 16}
	threeDimSlice[1][1] = []int{17, 18, 19, 20}
	threeDimSlice[1][2] = []int{21, 22, 23, 24}

	// 访问元素
	fmt.Println(threeDimSlice[1][1][2]) // 输出: 19
}
```
:::

## Map

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

### 添加键值对

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

### 通过键获取值

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

### 遍历map

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

### map中移除元素

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

### 判断键的值是否存在

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

### 使用map的注意事项

::: warning map使用时的注意事项
- map是无序的，每次打印出来的map都会不一样，它不能通过index获取，而必须通过key获取。
- map的长度是不固定的，也就是和slice一样，也是一种引用类型。
- 内置的len函数同样适用于map，返回map拥有的key的数量。
- map的key可以是所有可比较的类型，如布尔型、整数型、浮点型、复杂型、字符串型...也可以键。
:::