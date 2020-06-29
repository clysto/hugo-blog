---
title: "LaTeX minted 包使用"
date: 2019-12-22T10:31:42.271Z
tags:
  - LaTeX
---


# LaTeX minted 包使用

## 基本使用

在使用LaTeX时常常要展示代码，LaTeX的**listings**包也可以完成这个工作但是效果不如**minted**好，minted包使用python环境来高亮代码段落，需要先在本机配置好python环境。

**下面是一个简单的示例：**

<!--more-->

```tex
\documentclass{ctexart}

\usepackage{minted}

\setminted{
	frame=lines
	tabsize=4
	encoding=utf8
}

\begin{document}


\begin{minted}{C}
#include <stdio.h>

int main(void) {
	printf("hello world!");
	return 0;
}
\end{minted}


\end{document}
```

使用` xelatex -shell-escape -8bit a.tex`命令进行编译得到如下结果。注意一定要加`-shell-escape`参数，在我的环境下不加`-8bit`每个tab会有一个奇怪的‘^’符号。

![image-20191222174712707.png](https://i.loli.net/2019/12/22/53c2wvamkLZt6jq.png)

使用`\setminted`命令可以对代码段进行设置，minted支持多种主题和语言，详细的设置可以阅读他的官方文档：

[minted 文档](https://mirror.bjtu.edu.cn/ctan/macros/latex/contrib/minted/minted.pdf)。



## 浮动代码块

这里我想主要介绍一下如何使用浮动的代码块让你的代码片段像图片一样成为一个浮动体，然后你可以给他设置caption和label在文段中引用它。下面的代码从文件中引入代码片段，然后将代码片段放进listing浮动体当中。后续LaTeX引擎会寻找最佳的位置放置此代码片段。

```tex
\documentclass{ctexart}

\usepackage{minted}

\setminted{
	frame=lines
	tabsize=4
	encoding=utf8
}

\begin{document}

\begin{listing}
\inputminted{C}{snippets/main.c}
\caption{你好世界}
\label{lst:example}
\end{listing}
代码 \ref{lst:example} 展示了如何使用C语言输出“你好世界”。



\end{document}
```

使用XeLaTeX编译两次得到如下结果：

![image-20191222180035919.png](https://i.loli.net/2019/12/22/pFwx2cVNlEmUMIO.png)

**进阶**

这还不够，我们可以使用cleverref来实现更好的应用效果，而不必每次都要自己输入“代码 \ref{lst:example} ”这样的应用方式。看下面的例子：

```tex
\documentclass{ctexart}

\usepackage{minted}
\usepackage{cleveref}

\setminted{
	frame=lines
	tabsize=4
	encoding=utf8
}

\renewcommand{\listingscaption}{代码}
\renewcommand\listoflistingscaption{代码示例}
\crefname{listing}{代码}{代码示例}

\begin{document}

\begin{listing}
\inputminted{C}{snippets/main.c}
\caption{你好世界}
\label{lst:example}
\end{listing}
\cref{lst:example} 展示了如何使用C语言输出“你好世界”。



\end{document}
```



![image-20191222180553241.png](https://i.loli.net/2019/12/22/mQqRMsjXy9AYZpG.png)







看到差别了吗，使用起来更加优雅了，你只需要引用它而不必要知道引用的东西到底是什么类型，cleveref会自动帮你加上例如“代码”、“图”、“表”等前缀。`\renewcommand{\listingscaption}{代码}`重置了在渲染代码的caption时的前缀。


![image-20191222180952770.png](https://i.loli.net/2019/12/22/E7hTIRG5x8FzygS.png)

如果你使用`\listoflistings`命令还可以罗列文章中所有的代码片段！

## 浮动代码段换页

当我们要引入很长的代码时使用浮动体可能不是一个好主意，他会出现下面这样的错误：

![image-20191222181703713.png](https://i.loli.net/2019/12/22/IacKFtM9kfvjbCQ.png)

代码就这样“戛然而止”了！你只需要加入caption包然后定义一个自定义环境`\newenvironment{longlisting}{\captionsetup{type=listing}}{}`就可以在longlisting里放下较长的代码了。

```tex
\documentclass{ctexart}

\usepackage{minted}
\usepackage{cleveref}
\usepackage{caption}

\setminted{
	frame=lines
	tabsize=4
	encoding=utf8
}

\newenvironment{longlisting}{\captionsetup{type=listing}}{}
\renewcommand{\listingscaption}{代码}
\renewcommand\listoflistingscaption{代码示例}
\crefname{listing}{代码}{代码示例}


\begin{document}

\begin{longlisting}
\inputminted{C}{snippets/main.c}
\caption{你好世界}
\label{lst:example}
\end{longlisting}
\cref{lst:example} 展示了如何使用C语言输出“你好世界”。

\listoflistings



\end{document}
```

