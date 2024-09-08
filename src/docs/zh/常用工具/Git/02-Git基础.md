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

![image-20](/images/docs/Git/assets/image-20.png)

**举个例子来说明一下Git的这三个区域**：我们可以将仓库理解为工厂里面的仓库，仓库里面有很多的货物（这些货物可以理解为我们的文件，包括代码文件、文本文件、图片文件等），工作区就是生产这些货物的车间，对我们的货物进行生产、加工和修改，车间生产完这些产品之后，就会将这些产品放到仓库里面，那么车间和仓库之间就需要一个运输工具，比如我们使用货车来运输货物，那么这个货车就是暂存区，车间生产完货物之后，将货物放到货车上，然后货车就会将货物从车间运输到仓库中保存起来。当我们的代码完成了一个阶段想存档的时候，就可以把这个版本放到本地仓库中保存起来，在版本控制系统中，这个保存到仓库的过程叫做提交，但是我们不是每次文件修改后都需要进行一次提交操作会比较麻烦，所以Git给我们提供了一种方式，也就是可以先将修改的文件添加到暂存区中，然后再把所有暂存区中的文件统一执行提交操作。联想到车间生产货物的运输到仓库的例子，并不是每次都需要先运送到仓库里面保存起来，而是先将货物都先放到货车上，然后再一次性的运输到仓库中保存起来。

## 添加和提交文件

这里涉及到 `git add` 命令、`git commit` 命令、`git status` 命令。

```shell
# 使用 git status 命令当前工作目录和暂存区的状态
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
# 使用 git status 命令当前工作目录和暂存区的状态
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

# 再次使用 git status 命令当前工作目录和暂存区的状态
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

# 再使用 git status 命令当前工作目录和暂存区的状态
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

# 使用 git status 命令当前工作目录和暂存区的状态
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

# 使用 git status 命令当前工作目录和暂存区的状态
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

# 使用 git status 命令当前工作目录和暂存区的状态
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

## 删除文件

git rm 命令的作用说明：从Git版本控制中移除文件或目录。

删除文件有两种常用的方式：
1. 删除文件后，使用 git rm 命令，将文件从Git版本控制中移除。
2. 使用 git rm <文件名> 将文件从Git工作区和Git暂存区中移除。

第一种方式案例演示：

```shell
# 创建一个仓库 my-repo
mkdir my-repo && cd my-repo && git init

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

# 使用 git log --oneline 命令查看提交记录
git log --oneline
adc77f0 (HEAD -> main) commit3
864a5b9 commit2
09a0788 commit1

# 使用 rm 命令删除 file1.txt 文件
rm file1.txt

# 使用 ls 命令查看当前工作区目录下的文件
ls
file2.txt	file3.txt

# 使用 git status 命令当前工作目录和暂存区的状态
git status
On branch main
Changes not staged for commit:
  # 这里会提示使用 git add/rm <file> 来更新将要提交的内容
  (use "git add/rm <file>..." to update what will be committed)
  # 这里会提示使用 git restore <file> 放弃工作目录中的更改
  (use "git restore <file>..." to discard changes in working directory)
	deleted:    file1.txt # 这里会提示删除 file1.txt 文件

# 这里会提示使用 git add 或 git commit -a 添加或提交更改
no changes added to commit (use "git add" and/or "git commit -a")

# 上面使用 rm 命令删除的文件，也仅仅是在工作区中删除，并没有从Git版本库中删除
# 使用 git ls-files 命令来查看暂存区中的内容，会发现 file1.txt 文件还在暂存区中
git ls-files
file1.txt
file2.txt
file3.txt

# 使用 git add 命令将 file1.txt 文件添加到暂存区
git add file1.txt # 或者 git add .

# 使用 git status 命令查看当前工作目录和暂存区的状态【file1.txt 】
git ls-files
file2.txt
file3.txt
```

以上的方式删除文件还是有点麻烦的，需要先将文件从工作区中删除，然后再将文件更新到暂存区中再提交。

那么 Git 也提供另一个方法来删除文件，即使用 git rm 命令。

第二种方式案例演示：

```shell
# 接下来删除 file2.txt 文件
git rm file2.txt

# 使用 git status 命令查看当前工作目录和暂存区的状态
git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	deleted:    file1.txt
	deleted:    file2.txt

# 使用 ls 命令查看当前工作区目录下的文件
ls
file3.txt # 这里只剩下一个 file3.txt 文件了

# 再使用 git ls-files 命令来查看暂存区中的内容，会发现 file1.txt 和 file2.txt 文件已经从暂存区中删除了
git ls-files
file3.txt

# 最后需要 git commit 将删除文件记录提交到本地仓库，否则工作区和暂存区删除的文件还是会存在于本地仓库中。
git commit -m "delete file1.txt and file2.txt"
```

## 忽略文件

Git 忽略文件（`.gitignore`）用于告诉 Git 哪些文件或目录不需要进行版本控制或跟踪，这样可以让仓库的体积更小、更加干净。这在排除编译生成的文件、临时文件、日志文件、系统生成的文件和敏感信息等方面特别有用。

忽略文件使用 `.gitignore` 文件来定义，`.gitignore` 文件放在 Git 仓库的根目录下，或者放在子目录中。

使用规则：
1. 每行指定一个忽略规则。
2. 可以使用通配符和模式匹配来指定多个文件或目录。

案例演示：

```shell
# 创建一个仓库 my-repo
mkdir my-repo && cd my-repo && git init

# 创建一个日志文件
echo "some log" > access.log

# 使用 git status 命令查看当前工作目录和暂存区的状态
git status
# 输出如下，可以看到 access.log 文件没有被跟踪
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	access.log

nothing added to commit but untracked files present (use "git add" to track)

# 在创建第二个日志文件
echo "other log" > other.log

# 将 access.log 添加到 .gitignore 文件中
echo "access.log" >> .gitignore

# 查看 .gitignore 文件是否添加到 access.log 内容
cat .gitignore

# 再次使用 git status 命令查看当前工作目录和暂存区的状态
git status
# 输出如下，可以看到 access.log 文件已经被忽略了
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.gitignore
	other.log

nothing added to commit but untracked files present (use "git add" to track)

# 把当前目录的所有内容提交到暂存区
git add .

# 然后提交到本地库
git commit -m "ignore file sample"

# 查看所有被 git 跟踪的文件
git ls-files

# 在 .gitignore 文件中添加一行 *.log 表示所有以 .log 结尾的文件都会被忽略
echo "*.log" >> .gitignore

# 查看 .gitignore 文件是否添加到 *.log 内容
cat .gitignore

# 在新建一个 hello.log 日志文件
echo "hello log" > hello.log

再次使用 git status 命令查看当前工作目录和暂存区的状态
git status
# 输出如下，可以看到 .log 为后缀的文件已经被忽略了，只有 .gitignore 文件的修改
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .gitignore

no changes added to commit (use "git add" and/or "git commit -a")

# 再次提交到本地库
git commit -am "test ignore log"

# 查看所有被 git 跟踪的文件
git ls-files

# 在other.log文件内添加一行新内容
echo "modified content" >> other.log

# 可以使用 git diff 查看工作区和暂存区的差异，也可以使用 git status 查看当前工作目录和暂存区的状态
# 得出结论：.gitignore 生效有一个前提就是这个文件不能是被添加到版本库中的
# 案例中已经将other.log文件提交到了版本库中，所以后续的修改都会被 git 所跟踪
git diff 或者 git status

# 想要移除 other.log 文件，使其在 .gitignore 中生效，需要使用 git rm 命令
# 这里 git rm 使用 --cached 参数，表示只从暂存区中移除文件，而不从版本库中删除文件
git rm --cached other.log

# 再次提交
git commit -am "delete other.log"

# 此时再去修改 other.log 文件，再使用 git status 查看，可以发现 other.log 文件已经被忽略了
echo "modified content" >> other.log
cat other.log
git status

# 在 temp 目录下创建一个 hello.txt 文件
echo "hello world" > temp/hello.txt

# 使用 git status 查看当前工作目录和暂存区的状态
# -s 参数表示查看 git 状态的简略模式
# -s 参数回显有两？问号，第一个问号表示：暂存区的状态，第二个问号表示：工作区的状态
git status -s

# 忽略 temp 目录下的所有文件
echo "temp/" >> .gitignore

# 使用 git status 查看当前工作目录和暂存区的状态
git status -s
```

说明一下 .gitignore 文件用于指定哪些文件或目录应该被Git忽略，不纳入版本控制。匹配规则如下：
- 每行指定一个忽略规则。
- 可以使用通配符来匹配文件或目录，常用的通配符包括：
   1. `*`：匹配零个或多个字符，包括空格。
   2. `?`：匹配任意一个字符，但不包括空格。
   3. `**`：递归匹配任意路径，例如 `**/foo` 会匹配 `a/foo`、`a/b/foo` 等。
- `/`：路径分隔符，可以在开头或中间使用，表示匹配某个路径下的文件或目录。
- `!`：在规则前面加上 `!` 表示取反，即不忽略该文件或目录。
- `#`：行首的 `#` 表示注释，忽略该行。

例如，以下是一个简单的 `.gitignore` 文件示例：

```shell
# 忽略所有 .log 文件
*.log

# 忽略所有 build 目录及其内容
/build/

# 但不忽略 build/important 目录
!build/important/

# 忽略所有 .tmp 结尾的文件
**/*.tmp
```

## 分支介绍和基本操作

分支（branch）是 Git 中的一个重要概念，它允许开发者在代码库中创建新的分支，并对这些分支进行独立开发。分支允许开发者在不影响主分支的情况下，安全地 experiment、develop、test 和 merge 代码，从而提高代码管理的效率和协作性。

![image-17](/images/docs/Git/assets/image-17.png)

我们可以把分支看作是代码库中的不同版本，可以独立存在，并且有自己的提交记录，就像是一棵树的不同枝干，每个枝干都有自己的生长轨迹，所以被形象的称为分支。

Git分支的使用场景非常多样化，主要包括以下几个方面：

- 并行开发（Parallel Development）：

  允许团队成员在不同的分支上独立开发不同的功能或修复不同的 bug，避免彼此之间的冲突和干扰。每个分支可以专注于特定的任务或特性开发，开发完成后再合并到主分支或其他适当的分支。

- 功能开发（Feature Development）：

  每个功能或特性可以在单独的分支上进行开发。这样可以保持主分支的稳定性，只有当功能完全开发和测试通过后才将其合并到主分支中。

- 版本发布（Release Management）：

  在准备发布新版本时，可以创建一个发布分支（release branch），在该分支上进行最后的测试、文档更新和准备工作。这样可以确保在发布前能够解决所有的问题和完成所有必要的准备工作。

- 热修复（Hotfixes）：

  当生产环境出现紧急 bug 需要立即修复时，可以从主分支上创建一个热修复分支（hotfix branch），在该分支上进行修复，然后将修复内容合并回主分支和开发分支。

- 实验性开发（Experimental Development）：

  如果需要尝试一些实验性的更改或新功能，可以创建一个专门的实验分支，尝试各种方法和实现，然后根据测试结果决定是否将其合并到主分支或其他适当的分支中。

- 团队协作（Collaboration）：

  多个开发者在同一个项目上工作时，可以通过创建和使用各自的分支来避免直接在主分支上进行修改，保证每个人的工作不会互相影响。
分支的使用使得团队能够更灵活地管理和控制代码的变化，有效地提高了开发效率和代码质量。通过合适的分支管理策略，可以确保团队在开发过程中能够保持代码的稳定性和可维护性。

分支案例说明：

```shell
# 创建一个 git 仓库
mkdir my-repo && cd my-repo && git init

# 在 main 分支创建 三次 提交记录
echo main1 > main1.txt
git add main1.txt
git commit -m "main:1"

echo main2 > main2.txt
git add main2.txt
git commit -m "main:2"

echo main3 > main3.txt
git add main3.txt
git commit -m "main:3"

# 使用 git branch 命令来查看当前仓库的所有分支
# 回显信息中 * 号表示当前所在的分支
git branch

# 可以使用 git branch 分支名 来创建一个新的分支，这里只是创建了分支，并没有切换到该分支上
git branch dev

# 再使用 git branch 命令来查看当前仓库的所有分支，这时就多出了一个 dev 分支
git branch

# 使用 git checkout 分支名 来切换到指定的分支
# 使用 git checkout 来切换分支的时候，可能会存在一些潜在的问题
# 因为出了切换分支和状态之外，git checkout 命令还可以用来恢复文件或者目录到之前的某个一个状态
# 例如我们修改了某个文件，这个时候可以使用 git checkout 命令来恢复我们修改之前的状态
# 而这个时候分支名称和文件名称相同的话，就会出现歧义
# git checkout 命令会默认切换分支，而不是恢复文件，为了避免这种歧义
# 可以使用 git switch 命令来替换 checkout 来切换分支
git checkout dev

# 使用 git switch 命令来进行分支切换（git 2.23版本才有的 git switch 命令）
git switch main

# 再次使用 git branch 命令来查看当前仓库的所有分支，这时就切换到了 dev 分支上【 *号在 dev 分支上】
git branch

# 在 dev 分支创建两次提交记录
echo dev1 > dev1.txt
git add dev1.txt
git commit -m "dev:1"

echo dev2 > dev2.txt
git add dev2.txt
git commit -m "dev:2"

# 切换回 main 分支，再创建两次提交
git switch main

echo main4 > main4.txt
git add main4.txt
git commit -m "main:4"

echo main5 > main5.txt
git add main5.txt
git commit -m "main:5"

# 现在将 dev 分支合并到 main 分支，这条命令是在 main 分支操作的。在 main 分支上执行 merge 操作
git merge dev

# 可以通过以下命令查看 git 分支的视图
git log --graph --oneline --decorate --all

# 删除dev分支
# 强制删除 git branch -D 分支名称
git branch -d dev

# 再使用 git branch 命令来查看当前仓库的所有分支，这时就删除了 dev 分支
git branch
```

上面案例简单描述了 Git 分支的基本操作，包括创建、切换、合并等。现在介绍合并分支的时候如何解决冲突，一般情况下，如果两个分支的修改内容没有重合的部分的话，那么合并分支就回非常简单，Git 会为我们自动完成合并，但是如果两个分支修改了同一个文件的同一行的话，Git 就不知道应该保留哪个分支的修改内容了，就产生了冲突，这个时候就需要我们手动来解决冲突。

继续使用上面的案例来演示：

```shell
# 创建一个 feat 分支
git branch feat

# 切换到 feat 分支
git switch feat

# 使用 vim 修改 main1.txt 文件
vim main1.txt

# 修改后提交
git commit -a -m "feat: update main1.txt"

# 然后切换回 main 分支
git switch main

# 修改一下 main 分支的 main1.txt 文件
vim main1.txt

# 修改后提交
git commit -a -m "main: update main1.txt"

# 这个时候 main 分支和 feat 分支的 main1.txt 文件的修改内容就有了分歧
# 这是在 main 分支尝试合并 feat 分支的修改内容，将feat 分支的修改合并到 main 分支
git merge feat

# 可以使用 git diff 查看冲突
git diff
# 输出如下
diff --cc main1.txt
index 56c92cd,178d67b..0000000
--- a/main1.txt
+++ b/main1.txt
@@@ -1,2 -1,2 +1,6 @@@
  main1 # 文件名
++<<<<<<< HEAD
++golang学习笔记 # main分支添加的内容
++=======
++修改这一行内容 # feat分支添加的内容
++>>>>>>> feat

# 然后手动编辑 main 分支的 main1.txt 文件，将 feat 分支的修改内容添加到 main1.txt 文件中
vim main1.txt

# 然后再将 main1.txt 文件添加到暂存区，在提交到本地库（这里提交会自动合并）
# 在提交之前，如果想中断这次合并的话，可以使用 git merge --abort 这命令来终止合并
git add main1.txt
git commit -m "main: resolve conflict"
```

除了 git merge 命令之外，还有另一个方法可以将不同分支的修改内容整合到一起，这个命令就是 git rebase 命令。

继续使用上面的案例来演示 git rebase 命令：

```shell
# 切换到 main 分支
git switch main

# 将 feat 分支删除
git branch -d feat

# 将 dev:2 提交记录恢复
# git checkout -b dev 提交ID
# 这个提交ID 可以通过 git log --oneline --graph --decorate --all 来查看
# 觉得 git log --oneline --graph --decorate --all 命令太长的话，可以使用 alias 来简化命令
# alias graph="git log --oneline --graph --decorate --all"
git checkout -b dev 0baca13 # 这是 dev 分支就恢复到 dev:2 这次提交

# 切换回 main 分支
git switch main

# 将 main 分支回退到 main:5 这次提交，使用 hard 模式
git reset --hard 9483643

# 恢复之后，将该 git 仓库复制两份份
cp -rf my-repo rebase1
cp -rf my-repo rebase2
```

或者重新创建一个项目案例：

```shell
# 创建一个 git 仓库
mkdir my-repo && cd my-repo && git init

# 在 main 分支创建 三次 提交记录
echo main1 > main1.txt
git add main1.txt
git commit -m "main:1"

echo main2 > main2.txt
git add main2.txt
git commit -m "main:2"

echo main3 > main3.txt
git add main3.txt
git commit -m "main:3"

# 创建一个 dev 分支
git branch dev

# 切换到 dev 分支
git switch dev

# 在 dev 分支创建两次提交记录
echo dev1 > dev1.txt
git add dev1.txt
git commit -m "dev:1"

echo dev2 > dev2.txt
git add dev2.txt
git commit -m "dev:2"

# 切换回 main 分支，再创建两次提交
git switch main

echo main4 > main4.txt
git add main4.txt
git commit -m "main:4"

echo main5 > main5.txt
git add main5.txt
git commit -m "main:5"

# 将该 git 仓库复制两份份
cp -rf my-repo rebase1
cp -rf my-repo rebase2
```

在 dev 分支执行 git rebase 命令。

```shell
# 切换到 rebase1 目录
cd rebase1

# 切换到 dev 分支
git switch dev

# 执行 rebase 命令
git rebase main

# 可以使用 git log 图形的方式查看提交记录
git log --oneline --graph --decorate --all
```

![image-18](/images/docs/Git/assets/image-18.png)

在 main 分支执行 git rebase 命令。

```shell
# 切换到 rebase2 目录
cd rebase2

# 切换到 main 分支
git switch main

# 执行 rebase 命令
git rebase dev

git log --oneline --graph --decorate --all
```

![image-19](/images/docs/Git/assets/image-19.png)

在两个案例中，无论是 main 分支上还是在 dev 分支上执行 git rebase 命令之后，提交结果都是一条直线，但是中间的顺序会稍微有些不同，这是由于 rebase 的机制导致的，在 Git 中，每个分支都有一个指针指向当前分支的最新提交记录，而在执行 rebase 操作的时候，Git 会先找到当前分支和目标分支的共同提交记录，在案例中也就是 main:3 这个提交节点，再把当前分支上从共同提交记录到最新提交记录的所有提交记录，这里是对于 dev 分支来说的，简单概述就是 git rebase 将当前分支的提交按顺序应用到目标分支上，以重写提交历史，使其看起来像是顺序连续的修改。

::: warning 注意事项
**git merge 和 git rebase 的区别**

merge
- 优点✅：不会破坏原分支的提交历史，方便回溯和查看。
- 缺点❌：会产生额外的提交节点，分支图比较复杂。

rebase
- 优点✅：不会新增额外的提交记录，形成线性历史，比较直观和干净。
- 缺点❌：会改变提交历史，改变了当前分支的branch out的节点，避免在公共分支上使用。
:::

## 分支管理和工作流模型

工作流模型就是一些比较好的规范和流程，可以让我们在使用 Git 时减少一些不必要的麻烦，提高工作效率。

下面介绍一下 GitFlow 工作流模型。

![GitFlow](/images/docs/Git/assets/image-21.png)

**GitFlow 的分支说明**：
- *生产分支（master 或者 main）*

  Master分支【main】是仓库的主分支，这个分支包含最近发布到生产环境的代码，最近发布的Release， 这个分支只能从其他分支合并，不能在这个分支直接修改。

- *补丁分支（hotfix）*

  当我们在生产环境发现新的Bug时候，我们需要基于master分支创建一个Hotfix分支，然后在Hotfix分支上修复bug，完成Hotfix后，我们要把hotfix分支合并回Master和Develop分支。

- *发布分支（release)*

  当你需要发布一个新功能的时候，要基于Develop分支创建一个Release分支，在Release分支测试并修复bug，完成release后，把release合并到master和develop分支。

- *开发分支（develop）*

  这个分支是我们的主开发分支，包含所有要发布到下一个Release的代码，这个主要合并与其他分支，比如Feature分支。

- *功能分支（feature）*

  feature分支主要是用来开发一个新的功能，一旦开发完成，我们合并回Develop分支进入下一个Release。

当我们新建git仓库之后，默认会创建一个主分支也就是master分支，由于master分支是用于发布生产环境，所有必须保证master上代码的稳定性，所以我们不能直接在master分支上修改提交。我们要基于master分支创建一个develop分支，develop分支用于保存开发好的相对稳定的功能，master分支和develop分支是仓库的常驻分支，一直会保留在仓库中。

![image-22](/images/docs/Git/assets/image-22.png)

当新的开发任务来了之后，就要编写代码了，我们尽量不要在develop分支上写代码，要保证develop分支的相对稳定，所以这时我要就要基于develop 分支创建一个临时的开发分支，然后在开发分支上编写代码，等功能开发完之后我们再把开发分支合并到develop上。

![image-23](/images/docs/Git/assets/image-23.png)

新功能合并到develop分支之后，我们想把新功能发布到生产环境，首先基于develop分支创建release分支，然后在release分支测试完成之后，把release分别合并到master分支和develop分支。

![image-24](/images/docs/Git/assets/image-24.png)

release分支合并到master分支之后，在master分支上打标签用于发布。

![image-25](/images/docs/Git/assets/image-25.png)

我们把代码发布到了生产环境，用户在使用的时候给我们反馈了一个bug，这时我们需要基于master分支创建一个hotfix 分支，用于修复bug，bug修好之后，把hotfix 分支分别合并到master分支和develop分支。

![image-26](/images/docs/Git/assets/image-26.png)

**GitFlow工具**

安装GitFlow工具：

::: code-group
```shell [MacOS]
brew install git-flow
```

```shell [Windows]
wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | bash
```

```shell [Ubuntu]
apt-get install git-flow
```
:::

::: tip 提示
文档正在更新中...
:::