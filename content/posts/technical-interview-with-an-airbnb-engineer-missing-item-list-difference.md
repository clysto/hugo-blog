---
title: "Technical interview with an Airbnb engineer: Missing item list difference"
date: 2019-05-24T15:16:18.762Z
tags:
  - 面试
  - 学习
---



# Technical interview with an Airbnb engineer: Missing item list difference

> 面试内容摘自：<https://interviewing.io/recordings/Python-Airbnb-4/>
>
> 视频地址：<https://www.youtube.com/watch?v=cdCeU8DJvPM>

**这个面试中总共提及了两个问题：**

1. 写一个反转字符串的函数
2. 给出一个由不同整数组成的未排序的数组（size n + 1），第二个数组和刚才的数组一致，但是缺少了一个整数元素（size n），找出缺失的那个整数

<!--more-->

## reverse

面试小哥给出的第一个版本是：

```python
def reverse(x):
    output = ""
    for c in x:
    	output = c + output

    return output
```

接着面试者问到了这个算法的时间复杂度和空间复杂度，面试小哥给出的回答是这样的：

> Time is going to be `O(n)`, basically looking at every character once which I don't think you could do better than...you could do it in half the passes if you did it in place and swapped characters but you're still going to be `O(n)`. And space complexity: we're adding another variable output here of the same size, so we could reduce that to `O(1)` by doing it in-place in the same string. So actually you cannot do that because strings are not mutable.

小哥认为最优的时间复杂度应当是`O(n)`，即使是遍历数组长度的一半然后首尾交换时间复杂度仍然是线性，空间复杂度应当是 `O(1)`，但是由于在python中，字符串类型是不可变对象，在每次循环中，都会在内存中开辟一个新的空间去存储字符串相加的结果，所以空间复杂度最好只能是`O(n)`。

真的是这样的吗？关于空间复杂度，由于在python中，**字符串类型是不可变对象**，所以确实没办法做到`O(1)`的空间复杂度。但是至于时间复杂度，在遍历的每一次当中，都执行了`output = c + output`的操作，在字符串相加的操作中，**两个字符串所有的字符都要被拷贝的一块新的地址空间，这个操作的时间复杂度是`O(N+M)`，所以整个算法应当是指数时间复杂度。**

小哥随后意识到了这个问题，于是他将字符串看成字符组成的数组，避免了字符串相加的操作。

```python
def reverese(x):
	output_len = len(x)
	output = [NONE] * output_len
	output_index = output_len - 1
	for c in x:
        output[output_index] = c
        output_index -= 1

    return ''.join(output)
```

这样整体的时间复杂度就是`O(n)`了。

## find_missing

题目就是要找到第二个数组和第一个数组相比缺失的元素

```python
# find_missing(
#   [4, 12, 9, 5, 6],
#   [4, 9, 12, 6]
# ) => 5
```

面试小哥给出的第一个版本是：

```python
def find_missing(full_set, partial_set):
    missing_items = set(full_set) - set(partial_set)
    assert(len(missing_items) == 1)

    return list(missing_items)[0]
```

同样面试者问到了这个算法的时间复杂度和空间复杂度，面试小哥给出的回答是这样的：

> So converting to a set assume it's going to take linear time because you're basically just populating a hash table I assume it's similar to how python implements it. So if you have m and n as the sizes of the two arrays, so they're both going to be linear and finding the difference should also be a linear operation.

没错，从`list`转为`set`是`O(n)`的复杂度，减法运算仍然是`O(n)`的复杂度，所以这个算法的时间复杂度和空间复杂度都是`O(n)`。
