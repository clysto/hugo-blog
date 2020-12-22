---
title: "SRT指北-从0开始开发你的AI项目"
date: 2020-12-06T23:11:23+08:00
draft: false
tags: ["AI", "SRT", "Python"]
keywords: ["AI", "SRT", "Python"]
---

前一段时间我的SRT项目终于结题了，可以说我对自己的工作十分不满意，一方面来源于自己的拖延症，另一方面则是欠缺对这种AI小项目的开发经验。不管怎么说我们组的项目总算是结题了，经过一些总结和探索，我整理出了一些SRT的项目经验，写在这里希望能给以后的同学一个参考。

> 我想说明一下：我并不是什么AI高手，甚至没有修过AI方面的课程，但是这并不影响你通过自学完成一个AI项目。同时我现在其实对AI算法也没有很深的理解，这需要很长时间的理论学习，和数学先修课的辅助才能真正入门AI。但是我们可以暂且先做一个“调包侠”。

<!--more-->

由于大部分的SRT项目都是围绕人工智能开发一个App，所以我着重分享一下有关AI项目的开发。大部分项目开始的时候都会感到很困难，其实原因有以下几点：

- 对项目的目标比较模糊
- 对AI算法感念模糊
- 难以掌握AI工具链（python, pytorch, numpy）
- 缺乏大型系统的开发经验

所以我从以上几点分别分享一下如何克服这些困难。

## 对项目的目标比较模糊

机器学习的常用方法，主要分为有监督学习(supervised learning)和无监督学习(unsupervised learning)。监督学习需要有明确的目标，很清楚自己想要什么结果。比如：按照“既定规则”来分类、预测某个具体的值等等，因此监督学习主要有两种任务：

- 分类
- 回归

监督学习是一种目的明确的训练方式，你知道得到的是什么，而无监督学习则是没有明确目的的训练方式，你无法提前知道结果是什么。我们在SRT项目中大部分都是监督学习，所以这个时候我们要**明确自己的目标是分类还是回归**。比如识别植物种类就是一个分类问题，预测支付宝里的芝麻信用分数就是一个回归问题。它们的本质区别是**预测结果的值是连续的还是离散的**。以大部分项目关注的分类问题为例，在你确定了他是一个分类问题之后就要按照如下步骤进行实践：

1. 选择一个适合目标任务的数学模型（神经网络？SVM？）
2. 先把一部分已知的“问题和答案”（训练集）给机器去学习（建立数据集）
3. 机器总结出了自己的“方法论”（训练模型）
4. 人类把”新的问题”（测试集）给机器，让他去解答（测试）


## 对AI算法感念模糊

这个问题也困扰了我很多，其实我们不必在这一部分花费太多时间，我也曾经像你们一样买来西瓜书慢慢啃，这确实对我们理解机器学习有帮助，但是在这如此短的时间中我们是无法通过自学来掌握机器学习的（大神除外）。我们其实只需要理解一些基本的概念，暂且将一个模型想象成一个黑盒，或者一个函数`f()`，对于图片识别，`f`接受的参数就是图片，输出的就是图片的类别，这个模型在起初会很糟糕，但是在数据集的调教下会一步一步教会他如何做出有效的预测。

## 难以掌握AI工具链

Python可谓是机器学习领域的当红明星，pytorch则是广泛应用于深度学习中，还有更基础的sklern，numpy，绘图用的matplotlib，如此多的工具学习起来也会十分困难。我建议先学习一些python基础的知识，尤其是关于python模块之类的知识，然后循序渐进的学习自己需要的工具，这些工具的官方文档都写的很好，同时可以搜到大量的网络教程，都是不错的学习材料。

## 缺乏大型系统的开发经验

我之前开发过一些React项目，得益于之前开发web的经验，我并没有在这一部分消耗太多时间。如果你不知道从哪里写下你的第一行代码，不妨多看一看别人的项目，我前一段时间写了一个非常精简的AI项目，所使用的算法也十分简单，但是它拥有训练代码，测试代码，还带有一个小的web程序，可以算是一个精简版的SRT项目代码：

> 项目地址：[MNIST](https://github.com/clysto/MNIST)

它使用两层全连接层实现神经网络，在MNIST数据集上训练，可以用来识别手写数字。大家可以参考一下这个项目的结构，和代码的组织。

## 结语

再次重申一下：我并不是什么AI高手，甚至没有修过AI方面的课程，但是这并不影响你通过自学完成一个AI项目。同时我现在其实对AI算法也没有很深的理解，这需要很长时间的理论学习，和数学先修课的辅助才能真正入门AI。但是我们可以暂且先做一个“调包侠”。所以遇到困难的时候不妨就让困难待在那里，SRT只是一个训练我们科研能力，教会你一些基本科研流程的项目，你可能并不能通过这个项目就能精通机器学习。当然对于AI高手来说，他们肯定就很轻松的能完成这些项目，自然也不会看到这里😛！