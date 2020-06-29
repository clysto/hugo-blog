---
title: "git log 输出乱码"
date: 2019-09-07T08:44:16.662Z
tags: 	
  - 教程
  - git
  - powershell
---



# git log 输出乱码

> 在使用git的时候发现在powershell下显示中文乱码，解决方法如下

<!--more-->

![1567845152736.png](https://i.loli.net/2019/09/07/CWrLziMsaKPfOX8.png)

`win`+`s`搜索“env”编辑系统环境变量，加入系统变量**LESSCHARSET**，值为**utf-8**。

![1567845316407.png](https://i.loli.net/2019/09/07/KfSXaG5ygHu7R8l.png)

![1567845423352.png](https://i.loli.net/2019/09/07/csjqwdKtZC9pLPG.png)

保存重新打开powershell即可。

![1567845476006.png](https://i.loli.net/2019/09/07/NGCYJqPUg9Sel2m.png)

