# Java简介

## 什么是Java？

Java是一种广泛使用的面向对象编程语言，具有跨平台、高性能、安全和稳定等特性。它由Sun Microsystems（现为Oracle公司的一部分）于1995年首次发布。

下载JDK官方地址：[https://www.oracle.com/cis/java/technologies/downloads/](https://www.oracle.com/cis/java/technologies/downloads/)

Java Logo 如下图所示：

<img src="/images/docs/Java/Java基础/assets/image-01.png" alt="Java Logo" style="width: 25%; height: auto;" />

## Java发展历史

20世纪90年代 ，硬件领域出现了单片式计算机系统，这种价格低廉的系统一出现就立即引起了自动控制领域人员的注意，因为使用它可以大幅度提升消费类电子产品（如电视机顶盒、面包烤箱、移动电话等）的智能化程度。Sun公司为了抢占市场先机，在1991年成立了一个称为Green的项目小组，帕特里克、詹姆斯·高斯林、麦克·舍林丹和其他几个工程师一起组成的工作小组在加利福尼亚州门洛帕克市沙丘路的一个小工作室里面研究开发新技术，专攻计算机在家电产品上的嵌入式应用。

由于C++所具有的优势，该项目组的研究人员首先考虑采用C++来编写程序。但对于硬件资源极其匮乏的单片式系统来说，C++程序过于复杂和庞大。另外由于消费电子产品所采用的嵌入式处理器芯片的种类繁杂，如何让编写的程序跨平台运行也是个难题。为了解决困难，他们首先着眼于语言的开发，假设了一种结构简单、符合嵌入式应用需要的硬件平台体系结构并为其制定了相应的规范，其中就定义了这种硬件平台的二进制机器码指令系统（即后来成为“字节码”的指令系统），以待语言开发成功后，能有半导体芯片生产商开发和生产这种硬件平台。对于新语言的设计，Sun公司研发人员并没有开发一种全新的语言，而是根据嵌入式软件的要求，对C++进行了改造，去除了留在C++的一些不太实用及影响安全的成分，并结合嵌入式系统的实时性要求，开发了一种称为Oak的面向对象语言。

由于在开发Oak语言时，尚且不存在运行字节码的硬件平台，所以为了在开发时可以对这种语言进行实验研究，他们就在已有的硬件和软件平台基础上，按照自己所指定的规范，用软件建设了一个运行平台，整个系统除了比C++更加简单之外，没有什么大的区别。1992年的夏天，当Oak语言开发成功后，研究者们向硬件生产商进行演示了Green操作系统、Oak的程序设计语言、类库和其硬件，以说服他们使用Oak语言生产硬件芯片，但是，硬件生产商并未对此产生极大的热情。因为他们认为，在所有人对Oak语言还一无所知的情况下，就生产硬件产品的风险实在太大了，所以Oak语言也就因为缺乏硬件的支持而无法进入市场，从而被搁置了下来。

1994年 6、7月间，在经历了一场历时三天的讨论之后，团队决定再一次改变了努力的目标，这次他们决定将该技术应用于万维网。他们认为随着Mosaic浏览器的到来，因特网正在向同样的高度互动的远景演变，而这一远景正是他们在有线电视网中看到的。作为原型，帕特里克·诺顿写了一个小型万维网浏览器WebRunner。

1995年 ，互联网的蓬勃发展给了Oak机会。业界为了使死板、单调的静态网页能够“灵活”起来，急需一种软件技术来开发一种程序，这种程序可以通过网络传播并且能够跨平台运行。于是，世界各大IT企业为此纷纷投入了大量的人力、物力和财力。这个时候，Sun公司想起了那个被搁置起来很久的Oak，并且重新审视了那个用软件编写的试验平台，由于它是按照嵌入式系统硬件平台体系结构进行编写的，所以非常小，特别适用于网络上的传输系统，而Oak也是一种精简的语言，程序非常小，适合在网络上传输。Sun公司首先推出了可以嵌入网页并且可以随同网页在网络上传输的Applet（Applet是一种将小程序嵌入到网页中进行执行的技术），并将Oak更名为Java（在申请注册商标时，发现Oak已经被人使用了，再想了一系列名字之后，最终，使用了提议者在喝一杯Java咖啡时无意提到的Java词语）。

1995年5月23日，Sun公司在Sun world会议上正式发布Java和HotJava浏览器。IBM、Apple、DEC、Adobe、HP、Oracle、Netscape和微软等各大公司都纷纷停止了自己的相关开发项目，竞相购买了Java使用许可证，并为自己的产品开发了相应的Java平台。

1996年 1月，Sun公司发布了Java的第一个开发工具包（JDK 1.0），这是Java发展历程中的重要里程碑，标志着Java成为一种独立的开发工具。9月，约8.3万个网页应用了Java技术来制作。10月，Sun公司发布了Java平台的第一个即时（JIT）编译器。

1997年 2月，JDK 1.1面世，在随后的3周时间里，达到了22万次的下载量。4月2日，Java One会议召开，参会者逾一万人，创当时全球同类会议规模之纪录。9月，Java Developer Connection社区成员超过10万。

1998年 12月8日，第二代Java平台的企业版J2EE发布。1999年6月，Sun公司发布了第二代Java平台（简称为Java2）的3个版本：J2ME（Java2 Micro Edition，Java2平台的微型版），应用于移动、无线及有限资源的环境；J2SE（Java 2 Standard Edition，Java 2平台的标准版），应用于桌面环境；J2EE（Java 2Enterprise Edition，Java 2平台的企业版），应用于基于Java的应用服务器。Java 2平台的发布，是Java发展过程中最重要的一个里程碑，标志着Java的应用开始普及。

1999年 4月27日，HotSpot虚拟机发布。HotSpot虚拟机发布时是作为JDK 1.2的附加程序提供的，后来它成为了JDK 1.3及之后所有版本的Sun JDK的默认虚拟机。

2000年 5月，JDK1.3、JDK1.4和J2SE1.3相继发布，几周后其获得了Apple公司Mac OS X的工业标准的支持。2001年9月24日，J2EE1.3发布。2002年2月26日，J2SE1.4发布。自此Java的计算能力有了大幅提升，与J2SE1.3相比，其多了近62%的类和接口。在这些新特性当中，还提供了广泛的XML支持、安全套接字（Socket）支持（通过SSL与TLS协议）、全新的I/OAPI、正则表达式、日志与断言。

2004年 9月30日，J2SE1.5发布，成为Java语言发展史上的又一里程碑。为了表示该版本的重要性，J2SE 1.5更名为Java SE 5.0（内部版本号1.5.0），代号为“Tiger”，Tiger包含了从1996年发布1.0版本以来的最重大的更新，其中包括泛型支持、基本类型的自动装箱、改进的循环、枚举类型、格式化I/O及可变参数。

2005年 6月，JavaOne大会召开，SUN公司公开Java SE 6版本。此时，Java的各种版本已经更名以取消其中的数字"2"：J2EE更名为Java EE, J2SE更名为Java SE，J2ME更名为Java ME。

2006年 11月13日，Java技术的发明者Sun公司宣布，将Java技术作为免费软件对外发布。Sun公司正式发布的有关Java平台标准版的第一批源代码，以及Java迷你版的可执行源代码。从2007年3月起，全世界所有的开发人员均可对Java源代码进行修改。

2009年 04月20日，甲骨文公司以74亿美元收购Sun。

2010年 ，Java编程语言的共同创始人之一詹姆斯·高斯林从Oracle公司辞职。

2010年11月，由于甲骨文对于Java社区的不友善，因此Apache扬言将退出JCP。

2011年 7月28日，甲骨文公司举行了全球性的活动，以庆祝Java 7的推出，随后Java 7正式发布。

2014年 3月18日，甲骨文公司发布了Java 8正式版。

2017年 7月，甲骨文公司发布JDK 9。这个版本算是比较大的调整，加入了很早之前就规划的模块化功能。并且对整个JDK基于模块进行了重新编写。Java9提供了轻量级JSON API；使用G1作为默认的垃圾收集器，替代了之前默认使用的Paralel GC；引入了jShell这个交互性工具。并且全面支持HTTP 2.0。

2017年8月，甲骨文决定将JavaEE移交给开源组织，最后Eclipse基金会接手。

由于甲骨文不允许开源组织用Java的名号，于是Eclipse选出了"Jakarta EE"和"Enterprise Profile"两个后续名字，最终前者以64.4%的票数获胜。 也就是说，Java EE已经正式更名为Jakarta EE（雅加达）。

2018年 ，从2018年开始，每6个月就会发布一个Java版本，以更快地引入新特性。这里又分为LTS版和最新版。生产环境中最好只使用LTS版本，因为这个版本更加稳定，维护周期更长。

2018年3月21日，Java 10发布；2018年9月25日，Java 11 LTS发布。

2019年 ，2019年2月Java 12发布；2019年9月Java 13发布。

2020年 ，2020年3月17日，Java 14发布。2020年9月15日，Java 15发布。

2021年 ，2021年3月16日，Java SE 16发布；2021年9月14日，JavaSE 17 LTS发布。

2023年，2023年9月19日，Java 21 发布；LTS（长期支持版）推出了虚拟线程的新特性。

## Java能做什么？

Java广泛用于构建多种应用程序，包括但不限于：
- 企业级应用程序（OA、ERP、CRM、电子商务平台、银行和金融系统、供应链管理系统）
- Web应用程序（后端）
- 移动应用程序（Android）2017 年 Google 宣布 Kotlin 成为 Android 的官方语言。
- 大数据处理（Spark、Hadoop、Storm、Kafka等。）

## JDK、JRE和JVM

JDK（Java Development Kit）：翻译过来就是Java开发工具，用于开发Java应用程序的工具包，包含JRE以及编译器（javac）、库（rt.jar、tools.jar等）、调试器、文档生成工具和一些其他工具，使开发人员能够编写、编译和调试Java代码。

JRE（Java Runtime Environment）：翻译过来就是Java运行环境，它是用于运行Java应用程序的环境。JRE提供了Java虚拟机（JVM）和Java类库，使得用户可以执行Java程序。

JVM（Java Virtual Machine）：Java虚拟机是Java平台的核心组件，负责执行Java字节码。它允许Java程序在不同的硬件和操作系统上运行。JVM的主要功能包括：将Java编译器生成的字节码转换为机器代码、管理内存分配和垃圾回收、通过类加载器和字节码验证，确保Java程序的安全运行、实现“编写一次，到处运行”的理念。

JDK、JRE和JVM的联系与区别，如下图所示：

![JDK、JRE和JVM的联系与区别](/images/docs/Java/Java基础/assets/image-02.png)

## 认识Java虚拟机

Java 的 JVM（Java Virtual Machine）是 Java 虚拟机的缩写，它负责 Java 程序的具体运行。Java 程序在运行时，会被编译成字节码文件，然后由 JVM 解释执行，因此 JVM 也被称为解释器。JVM 可以在不同的操作系统上运行 Java 应用程序，保证了 Java 的跨平台性。

<img src="/images/docs/Java/Java基础/assets/image-03.png" alt="Java Logo" style="width: 100%; height: auto;" />

JVM 由以下重要组件：
- 类加载子系统：将字节码文件（Xxx.class）加载到内存中，并生成对应的类对象。
- 运行时数据区：包括方法区、堆、虚拟机栈、程序计数器、本地方法栈，用于存储 Java 程序运行时所需的数据。
- 执行引擎：解释执行字节码文件，将字节码文件转换成机器码并执行。
- 本地库接口：调用本地方法库，实现 Java 程序与本地系统的交互。

## 安装和配置环境

### Linux

略

### MacOS

略

### Windows

略

## 入门程序

配置好环境之后，开始编写第一个 Java 程序 “Hello World”。

创建一个 HelloWorld.java 的文件，注意：这个文件的后缀名是 `.java` 的，内容如下：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

然后打开终端切换到 `HelloWorld.java` 文件的目录下执行 javac 编译 `HelloWorld.java` 文件，编译后会产生一个 `HelloWorld.class` 的字节码文件。

```shell
javac HelloWorld.java
```

使用 java 命令运行 `HelloWorld.class` 的字节码文件。

```shell
# 运行 HelloWorld.java
java HelloWorld

# 终端输出的结果如下：
Hello World!
```

## 参考资料

- [https://www.anseon.cn/java/threshold/history-trait.html#发展历程](https://www.anseon.cn/java/threshold/history-trait.html#发展历程)

::: tip 提示
文档正在更新中...
:::