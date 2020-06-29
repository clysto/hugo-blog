---
title: '在LaTeX中创建两栏布局'
date: 2020-05-19T00:43:45+08:00
tags: ['LaTeX']
---

在撰写论文的时候经常会使用两栏布局，其实实现两栏布局十分容易。只需要在`documentclass`的设置中添加`twocolumn`参数即可，但是这样设置的话全篇文章都会被分栏。

<!--more-->

```tex
\documentclass[twocolumn]{ctexart}

\usepackage{zhlipsum}
\usepackage{geometry}
\geometry{a4paper,scale=0.8}

\title{某职业技术大学毕业论文}
\author{王花花}


\begin{document}

\maketitle

\begin{abstract}
	\zhlipsum[1]
\end{abstract}

\zhlipsum[5-8]

\end{document}
```

![image.png](https://i.loli.net/2020/05/19/ZKrCIhuj6PtM7wE.png)

## 摘要不参与分栏

如果想让摘要不分栏的话就需要单独设置`@twocolumnfalse`环境。

```tex
\documentclass[twocolumn]{ctexart}

\usepackage{zhlipsum}
\usepackage{geometry}
\geometry{a4paper,scale=0.8}

\title{某职业技术大学毕业论文}
\author{王花花}

\newcommand*{\sometext}{\zhlipsum[1]}

\begin{document}
	
\twocolumn[
\begin{@twocolumnfalse}
	\maketitle
	\begin{abstract}
		\sometext
	\end{abstract}
\end{@twocolumnfalse}
]

\zhlipsum[5-8]

\end{document}
```

![image.png](https://i.loli.net/2020/05/19/AmcZWlFKgjevNoy.png)

这样生成以后会发现摘要和正文之间的距离太小了，我们可以使用`\vspace`指令来增加垂直间距

```tex
\twocolumn[
\begin{@twocolumnfalse}
	\maketitle
	\begin{abstract}
		\sometext
	\end{abstract}
	\vspace{1em}
\end{@twocolumnfalse}
]
```

![image.png](https://i.loli.net/2020/05/19/jL4VcHht35zIdPT.png)
