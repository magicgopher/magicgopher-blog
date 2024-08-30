# Git基础

## 新建仓库

仓库（英文：Repository）简写为repo，是git用来存放代码的地方，其实就是一个目录，这个目录里面所有的文件都可以被 Git 管理起来，每个文件的修改、删除、添加等操作 Git 都能够跟踪，并且可以对这些文件进行版本管理。

新建git仓库有两种方式：
1. 在现有目录中初始化仓库。
2. 使用 git clone 命令将远程仓库克隆到本地。

使用 `git init` 命令将一个现有的文件目录初始化为 git 仓库。

```shell
# 创建一个名为 git-demo1 的目录
mkdir git-demo1

# 进入目录
cd git-demo1

# 初始化仓库
git init

# 输出如下
Initialized empty Git repository in /path/to/git-demo1/.git/

# 使用 ls -a 命令查看隐藏文件 .git
ls -a
```

使用 `git clone <url>` 命令将远程仓库克隆到本地。

```shell
# 这里以开源项目 kubernetes 为例
git clone https://github.com/kubernetes/kubernetes.git

# git clone 到本地后，修改目录名称为 k8s
git clone https://github.com/kubernetes/kubernetes.git k8s
```

## 工作区域和文件状态

![三个工作区域](/images/docs/Git/assets/image-12.png)

Git 仓库中有三个工作区域：
1. 工作区（Working Directory）*车间*
2. 暂存区（Staging Area）*运输工具 => 货车*
3. 本地仓库（Local Repository）*仓库*

![文件5个状态](/images/docs/Git/assets/image-13.png)

Git 仓库中文件有5个状态：
1. 未跟踪状态（Untrack）
2. 未修改（Unmodified）
3. 已修改（Modified）
4. 已暂存（Staged）
5. 已提交（Committed）

**举个例子来说明一下Git的这三个区域**：我们可以将仓库理解为工厂里面的仓库，仓库里面有很多的货物（这些货物可以理解为我们的文件，包括代码文件、文本文件、图片文件等），工作区就是生产这些货物的车间，对我们的货物进行生产、加工和修改，车间生产完这些产品之后，就会将这些产品放到仓库里面，那么车间和仓库之间就需要一个运输工具，比如我们使用货车来运输货物，那么这个货车就是暂存区，车间生产完货物之后，将货物放到货车上，然后货车就会将货物从车间运输到仓库中保存起来。当我们的代码完成了一个阶段想存档的时候，就可以把这个版本放到本地仓库中保存起来，在版本控制系统中，这个保存到仓库的过程叫做提交，但是我们不是每次文件修改后都需要进行一次提交操作会比较麻烦，所以Git给我们提供了一种方式，也就是可以先将修改的文件添加到暂存区中，然后再把所有暂存区中的文件统一执行提交操作。联想到车间生产货物的运输到仓库的例子，并不是每次都需要先运送到仓库里面保存起来，而是先将货物都先放到货车上，然后再一次性的运输到仓库中保存起来。

## 添加和提交文件

这里涉及到 `git add` 命令、`git commit` 命令、`git status` 命令。

```shell
git status

# 输出如下
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
````

新建一个 file1.txt 文件，并添加内容。

```shell
cat > file1.txt << EOF
这是第一个文件
EOF
```

再使用 `git status` 命令查看文件状态。

```shell
git status

# 输出如下
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	file1.txt

nothing added to commit but untracked files present (use "git add" to track)
```

使用 `git add` 命令将文件添加到暂存区，等待后续的提交操作（git commit）。

```shell
# 将文件添加到暂存区
git add file1.txt

# 再次使用git status命令查看文件状态
git status

# 输出如下
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   file1.txt
```

这里提示到 `git rm --cached <file>...` 这个操作也就是车间货车运输到仓库例子中，可以把放到货车上的货物再拿回来，那么这个拿回的货物就不会被运输到仓库。

现在货物已经在货车上了，需要使用 `git commit` 命令将货物提交到仓库中。

```shell
# 在工作区创建一个文件 file2.txt
cat > file2.txt << EOF
这是第二个文件
EOF

# git commit 命令只会提交暂存区的文件，也就是货车上的货物，而会提交工作区的文件，也就是车间的货物。
git commit -m "add file1.txt"

# 再使用 git status 命令查看文件状态
git status

# 输出如下
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	file2.txt

nothing added to commit but untracked files present (use "git add" to track)
```

这个 `git add <file>...` 命令可以添加多个文件，也可以使用通配符 `.` 来表示将当前目录下的所有文件添加到暂存区。

```shell
# 多个文件
git add file1.txt file2.txt file3.txt ...

# 通配符 *.txt 表示将当前目录下的所有以 .txt 结尾的文件添加到暂存区
git add *.txt

# . 表示将当前目录下的所有文件添加到暂存区
git add .
```

## 查看提交记录

`git log` 命令可以查看提交记录，`git log --oneline` 命令可以查看提交记录的精简版。

```shell
# 查看git提交记录完整版
git log

# 使用 --oneline 参数可以查看精简版提交记录
git log --oneline
```

## 回退版本

![image-14](/images/docs/Git/assets/image-14.png)

git reset的三种模式：对应于三种参数。
- `git reset --soft` 回退到某一个版本，并且保留工作区和暂存区的所有修改内容。
- `git reset --hard` 回退到某一个版本，并且丢弃工作区和暂存区的所有修改内容。
- `git reset --mixed` 介于soft和hard之间，回退到某一个版本，并且保留工作区的修改内容而丢弃暂存区中的修改内容。mixed是reset命令的默认参数。

**三种模式的案例演示**

将 repo 目录复制三份，分别对应三种模式的回退版本【都有三次git提交记录】。

```shell
# 创建一个repo文件夹，并初始化git仓库
mkdir repo && cd repo && git init

# 第一次提交
echo 111 > file1.txt
git add file1.txt
git commit -m "commit1"

# 第二次提交
echo 222 > file2.txt
git add file2.txt
git commit -m "commit2"

# 第三次提交
echo 333 > file3.txt
git add file3.txt
git commit -m "commit3"

# 使用git log命令查看提交记录
git log --oneline

# 使用cp命令将repo目录复制三份
cp -rf repo repo-soft
cp -rf repo repo-hard
cp -rf repo repo-mixed
```

首先演示 repo-soft 仓库在soft模式下的回退版本案例。

```shell
# 切换到 repo-soft 目录
cd repo-soft

# 使用git reset命令回退到上一个版本，使用 --soft 参数
git reset --soft HEAD^

# 使用git log --oneline命令查看提交记录，有commit1 和 commit2 两次提交记录
git log --oneline
4e03a17 (HEAD -> main) commit2
e4960b8 commit1

# 使用ls命令查看工作区的内容，有file1.txt	file2.txt	file3.txt 三个文件
ls
file1.txt	file2.txt	file3.txt

# 查看暂存区的内容
git ls-files
file1.txt
file2.txt
file3.txt

# 使用git status命令查看文件状态
git status

# 输出如下
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   file3.txt
```

repo-soft 仓库示例说明：git提交历史有三条提交记录，然后使用 `git reset --soft HEAD^` 这里使用的是 soft 模式，所以回退到上一个版本（也就是第二条提交记录），并且保留工作区和暂存区的所有修改内容，对于第二次提交来说，这个 file3.txt 文件就是一个新的文件。

接下来演示 repo-hard 仓库在hard模式下的回退版本案例。

```shell
# 切换到 repo-hard 目录
cd repo-hard

# 使用git reset命令回退到上一个版本，使用 --hard 参数
git reset --hard HEAD^

# 使用git log --oneline命令查看提交记录，有commit1 和 commit2 两次提交记录
git log --oneline
4e03a17 (HEAD -> main) commit2
e4960b8 commit1

# 使用ls命令查看工作区的内容，有 file1.txt	file2.txt 两个文件
ls
file1.txt	file2.txt

# 查看暂存区的内容
git ls-files
file1.txt
file2.txt

# 使用git status命令查看文件状态
git status
On branch main
nothing to commit, working tree clean
```

repo-hard 仓库示例说明：git提交历史有三条提交记录，然后使用 `git reset --hard HEAD^` 这里使用的是 hard 模式，所以回退到上一个版本（也就是第二条提交记录），并且丢弃工作区和暂存区的所有修改内容。git的第二次提交后，新增了一个 file3.txt 文件，但是由于使用了 hard 模式，所以这个文件被丢弃了。hard 模式所有未提交的更改和已暂存的更改都会被永久删除。这是一个不可逆的操作，所以使用时要小心。

最后演示 repo-mixed 仓库在mixed模式下的回退版本案例。

```shell
# 切换到 repo-mixed 目录
cd repo-mixed

# 使用git reset命令回退到上一个版本，使用 --mixed 参数
git reset --mixed HEAD^

# 使用git log --oneline命令查看提交记录，有commit1 和 commit2 两次提交记录
git log --oneline
4e03a17 (HEAD -> main) commit2
e4960b8 commit1

# 使用ls命令查看工作区的内容，有file1.txt	file2.txt	file3.txt 三个文件
ls
file1.txt	file2.txt	file3.txt

# 查看暂存区的内容
git ls-files
file1.txt
file2.txt

# 使用git status命令查看文件状态
git status
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	file3.txt

nothing added to commit but untracked files present (use "git add" to track)
```

repo-mixed 仓库示例说明：git提交历史有三条提交记录，然后使用 `git reset --mixed HEAD^` 这里使用的是 mixed 模式，所以回退到上一个版本（也就是第二条提交记录），并且保留工作区的修改内容而丢弃暂存区中的修改内容。对于第二次提交来说，这个 file3.txt 文件就是一个新的文件，但是由于使用了 mixed 模式会保留工作区的内容，所以这个文件被保留了，这里和 soft 模式不一样的是 mixed 模式只会保留工作区的内容，不会丢弃暂存区的内容。

## 查看差异

![image-15](/images/docs/Git/assets/image-15.png)

git diff 命令的作用说明：
1. 查看工作区、暂存区、本地仓库之间的差异。
2. 查看文件在不同版本之间的差异。
3. 查看文件在不同分支之间的差异。
4. git diff 无参数时，默认比较工作区（Working Directory）和 暂存区（Stage Area）之间的差异。

案例演示 git diff 命令的使用。

```shell
# 重新创建一个仓库 repo-diff
mkdir repo-diff && cd repo-diff && git init

# 创建三次 git 提交记录
echo 111 > file1.txt
git add file1.txt
git commit -m "commit1"

echo 222 > file2.txt
git add file2.txt
git commit -m "commit2"

echo 333 > file3.txt
git add file3.txt
git commit -m "commit3"

# 使用 vim 修改 file3.txt 文件的内容，修改为 Hello World!
vim file3.txt

# 使用 git diff 命令查看修改前后的差异
git diff
# 输出如下
# 第一行表示：发生变更的文件
# 第二行表示：55bd0ac这里是文件的哈希值，100644表示这个文件的权限
# 第三行：表示差异的旧版本文件。
# 第四行：表示差异的新版本文件。
# 第五行：@@：标志开始和结束；-1：旧文件的起始行号；+1：新文件的起始行号。
# 第六行：删除的内容
# 第七行：新增的内容
diff --git a/file3.txt b/file3.txt
index 55bd0ac..980a0d5 100644
--- a/file3.txt
+++ b/file3.txt
@@ -1 +1 @@
-333
+Hello World!

# 将修改后的 file3.txt 文件添加到暂存区
git add file3.txt

# 再使用 git diff 查看发现没有变化，说明此时工作区和暂存区之间没有差异。
git diff

# 使用 git diff HEAD 命令查看工作区和本地仓库（HEAD）之间的差异。
git diff HEAD
# 输出如下，说明工作区和版本库之间仍有差异。
diff --git a/file3.txt b/file3.txt
index 55bd0ac..980a0d5 100644
--- a/file3.txt
+++ b/file3.txt
@@ -1 +1 @@
-333
+Hello World!

# 使用 git diff --cached 命令查看暂存区和本地仓库（HEAD）之间的差异。
git diff --cached
# 输出如下，说明暂存区和版本库之间仍有差异。
diff --git a/file3.txt b/file3.txt
index 55bd0ac..980a0d5 100644
--- a/file3.txt
+++ b/file3.txt
@@ -1 +1 @@
-333
+Hello World!

# 将修改后的 file3.txt 文件提交到本地仓库
git commit -m "commit4"

# 再使用 git diff HEAD 查看工作区和本地仓库（HEAD）之间的差异，发现没有变化。
git diff HEAD

# 再使用 git diff --cached 查看暂存区和本地仓库（HEAD）之间的差异，发现没有变化。
git diff --cached
```

git diff比较不同提交ID的信息：
1. git diff [提交ID1] [提交ID2]
2. 可以用HEAD指向分支的最新的提交节点。
3. 比较HEAD和HEAD上一次的提交的信息：`git diff HEAD~ HEAD` 或 `git diff HEAD^ HEAD`。
4. 比较HEAD和HEAD之前第三个版本的信息：`git diff HEAD~3 HEAD`。
5. 只比较file3的内容：`git diff HEAD~3 HEAD file3.txt`。

::: warning 注意
<i>git diff 比较分支之间的差异后续分支内容时说明！</i>
:::

![image-16](/images/docs/Git/assets/image-16.png)