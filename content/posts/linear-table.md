---
title: "第二章 线性表"
date: 2019-04-23T05:04:09.605Z
tags:
  - C
  - 数据结构
---



# 第二章 线性表

## 2.1 线性表的类型定义

线性表中的元素可以是多种多样的，但同一线性表中的元素一定有相同的特性，即属于同一数据对象，**相邻元素之间存在序偶关系**。

## 2.2 线性表的顺序表示和实现

线性表的顺序表示指的是用一组连续的存储单元一次存储线性表的数据元素。不难想到，在C语言中数组是表示连续存储单元的最好方式。注意以下描述中元素的次序`i`均是从1开始而非数组中的0开始。数据元素的类型均为整型示范。

<!--more-->

#### 算法2.3 顺序表的初始化

通过构造体来定义顺序表的初始地址，当前长度，和大小。宏定义中`#define LIST_INCREASEMENT 10`指明了当向表中插入元素时，内存不够分配时该如何设置内存的增量。

> [tips]
>
> 由于顺序表的初始化涉及到对表的操作，所以再传参的时候需要传表的指针，这样才能修改表的长度并向第`i`个元素之前插入新的元素。

```c
#define LIST_INIT_SIZE 100
#define LIST_INCREASEMENT 10


typedef struct
{
    int* elem;
    unsigned int length;
    unsigned int listsize;
} SqList;


int InitList_Sq(SqList* L)
{
    // 创建一个空的线性表L
    L->elem = (int*)malloc(LIST_INIT_SIZE * sizeof(int));
    // 判断内存是否分配失败
    if (!L->elem) return 0;
    L->length = 0;
    L->listsize = LIST_INIT_SIZE;
    return 1;
}
```

#### 算法2.4 顺序表元素的插入

线性表的插入操作就是在第`i-1`个元素和第`i`个元素之间插入一个新的元素，并且使表长加一。`i`的范围是`1~L.length + 1`。这里与课本不同，在表达元素的次序时使用了`unsigned int`这个更精准的类型，在函数的使用上杜绝了次序小于0的情况。

```c
int ListInsert_Sq(SqList* L, unsigned int i, int e)
{
    // 在顺序线性表L中第i个位置之前插入新的元素
    if (i < 1 || i > L->length + 1) return 0;
    // 当存储空间已满，增加分配
    if (L->length >= L->listsize)
    {
        L->elem = (int*)realloc(L->elem, (L->listsize + LIST_INCREASEMENT) * sizeof(int));
        if (!L->elem) return 0;
        L->listsize += LIST_INCREASEMENT;
    }
    // q为插入位置
    int* q = L->elem + i - 1;
    int* p;
    // 插入位及之后的元素右移
    for (p = L->elem + L->length - 1; p >= q; --p)
    {
        *(p + 1) = *p;
    }
    *q = e;
    ++(L->length);
    return 1;
}
```

#### 算法2.5 顺序表元素的删除

线性表元素的删除就是删除表中第`i`个元素，并使后面的元素左移一位。`i`的范围是`1~L.length`。

> [tips]
>
> 注意这里函数要返回刚刚删除的元素，所以在参数中存在`int* e`，用于返回删除的值。在传参时我们可以传指针：
>
> ```c
> int* e = (int*)malloc(sizeof(int)); 
> ListDelete_Sq(&L, 1, e);
> ```
>
> 也可以传地址：
>
> ```c
> int e; 
> ListDelete_Sq(&L, 1, &e);
> ```
>
> 两种方法均可。

```c
int ListDelete_Sq(SqList* L, unsigned int i, int* e)
{
    // 在顺序表L中删除第i个元素，并用e返回其值
    if (i < 1 || i > L->length) return 0;
    // 删除位置
    int* q = L->elem + i - 1;
    *e = *q;
    int* p = L->elem + L->length - 1;
    // 删除位置之后的元素左移
    for (++q; q <= p; ++q)
    {
        *(q - 1) = *q;
    }
    --(L->length);
    return 1;
}
```

#### 算法2.6 顺序表元素的查找

```c
int LocateElem_Sq(SqList L, int e, int (*compare)(int, int))
{
    unsigned int i = 0;
    while (i < L.length && !compare(L.elem[i], e))
    {
        ++i;
    }
    if (i < L.length) return (int)(i + 1);
    else return 0;
}
```

#### 算法2.7 顺序表元素的合并

```c
int MergeList_Sq(SqList La, SqList Lb, SqList* Lc)
{
    // 已知顺序线性表La和Lb的元素按值非递减排列
    int* pa = La.elem, *pb = Lb.elem;
    Lc->listsize = Lc->length = La.length + Lb.length;
    int* pc = Lc->elem = (int*)malloc(Lc->listsize * sizeof(int));
    // 判断内存是否分配失败
    if (!Lc->elem) return 0;
    int* pa_last = pa + La.length - 1;
    int* pb_last = pb + Lb.length - 1;
    // 归并
    while (pa <= pa_last && pb <= pb_last)
    {
        if (*pa < *pb) *pc++ = *pa++;
        else *pc++ = *pb++;
    }
    while (pa <= pa_last) *pc++ = *pa++;
    while (pb <= pb_last) *pc++ = *pb++;
    return 1;
}
```

#### 补充 顺序表元素的遍历

```c
void ListTraverse_Sq(SqList L, void (*visit)(int val, unsigned int index))
{
    unsigned int i;
    for (i = 0; i < L.length; i++)
    {
        visit(L.elem[i], i + 1);
    }
}
```

## 2.3 线性表的链式表现和实现

### 2.3.1 线性链表

线性表的链式存储结构的特点是用一组**任意**的存储单元存储线性表的数据元素（这组存储单元可以是连续的，也可以是不连续的），如下图用表格的方式描述了一个单链表的组成。

**头指针**`H`：31（地址）

| 存储地址 | 数据域 | 指针域 |
| -------- | ------ | ------ |
| 1        | LI     | 43     |
| 7        | QIAN   | 13     |
| 13       | SUN    | 1      |
| 19       | WANG   | NULL   |
| 25       | WU     | 37     |
| 31       | ZHAO   | 7      |
| 37       | ZHENG  | 19     |
| 43       | ZHOU   | 25     |

**单链表可由头指针唯一确定**，在C语言中可用**结构指针**来描述：

```c
typedef struct LNode
{
    int data;              //数据域
    struct LNode* next;    //指针域
} LNode, *LinkList;        //LinkList是LNode*类型的别名
```

在单链表第一个节点之前附设一个节点，称之为**头节点**。头结点的数据域可以不存储任何信息，头结点的指针域存储指向第一个节点的指针（即第一个元素节点的存储位置）

![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Singly-linked-list.svg/408px-Singly-linked-list.svg.png)

#### 算法2.8 单链表元素的获得

```c
int GetElem_L(LinkList L, unsigned int i, int* e)
{
    LinkList p = L->next;
    unsigned int j = 1;
    while (p && j < i)
    {
        p = p->next;
        j++;
    }
    if (!p || i == 0) return 0;
    *e = p->data;
    return 1;
}
```

#### 算法2.9 单链表元素的插入

```c
int ListInsert_L(LinkList L, unsigned int i, int e)
{
    // 在带头节点的单链表L中的第i个位置之前插入元素e
    LinkList p = L;
    unsigned int j = 0;
    // 寻找第i-1个节点
    while (p && j < i - 1)
    {
        p = p->next;
        j++;
    }
    // i小于1或者大于表长+1
    if (!p || i == 0) return 0;
    // 生成新的节点
    LNode* s = (LNode*)malloc(sizeof(LNode));
    s->data = e;
    s->next = p->next;
    p->next = s;
    return 1;
}
```

#### 算法2.10 单链表元素的删除

```c
int ListDelete_L(LinkList L, unsigned int i, int* e)
{
    // 在带头节点的单链表L中删除第i个元素，并用e返回其值
    LinkList p = L, q;
    unsigned int j = 0;
    // 寻找第i-1个节点
    while (p && j < i - 1)
    {
        p = p->next;
        j++;
    }
    // 删除位置不合理
    if (!p->next || i == 0) return 0;
    q = p->next;
    p->next = p->next->next;
    *e = q->data;
    // 释放节点
    free(q);
    return 1;
}
```

#### 算法2.11 逆向建立单链表

```c
void CreateList_L(LinkList* L, unsigned int n)
{
    // 逆序输入n个元素的值，建立带表头的单链线性表L
    *L = (LNode*)malloc(sizeof(LNode));
    (*L)->next = NULL;
    unsigned int i;
    for (i = n; i > 0; --i)
    {
        LNode* p = (LNode*)malloc(sizeof (LNode));
        // 生成新节点
        scanf("%d", &p->data);
        p->next = (*L)->next;
        (*L)->next = p;
    }
}
```

#### 算法2.12 单链表元素的合并

```c
void MergeList_L(LinkList La, LinkList Lb, LinkList* Lc)
{
    // 已知单链表La和Lb的元素按值非递减排列
    LinkList pa = La->next, pb = Lb->next, pc;
    // pc指向La头节点
    *Lc = pc = La;
    while (pa && pb)
    {
        if (pa->data <= pb->data)
        {
            pc->next = pa;
            pc = pa; // pc向后移动
            pa = pa->next; // pa向后移动
        }
        else
        {
            pc->next = pb;
            pc = pb; // pc向后移动
            pb = pb->next; // pb向后移动
        }
    }
    pc->next = pa ? pa : pb;
    free(Lb);
}
```

#### 补充1 单链表元素的遍历

```c
void ListTraverse_L(LinkList L, void (*visit)(int val, unsigned int index))
{
    unsigned int i = 1;
    LinkList p = L->next;
    while (p)
    {
        visit(p->data, i++);
        p = p->next;
    }
}
```

#### 补充2 两个单链表的并集

>[info]
>
>补充1和补充2两个算法的要求是`La`，`Lb`两个带头结点的单链表已经按值非递减排列，经过运算后，`Lc`仍然按值非递减排列。

```c
#define NEW_NODE (LNode*)malloc(sizeof(LNode))

void ListUnion(LinkList La, LinkList Lb, LinkList Lc)
{
    LinkList pa = La->next, pb = Lb->next, pc = Lc;
    while (pa && pb)
    {
        if (pa->data == pb->data)
        {
            pc->next = NEW_NODE;
            pc->next->data = pa->data;
            pc->next->next = NULL;
            pa = pa->next;
            pb = pb->next;
        }
        else if (pa->data < pb->data)
        {
            pc->next = NEW_NODE;
            pc->next->data = pa->data;
            pc->next->next = NULL;
            pa = pa->next;
        }
        else
        {
            pc->next = NEW_NODE;
            pc->next->data = pb->data;
            pc->next->next = NULL;
            pb = pb->next;
        }
        pc = pc->next;
    }
    while (pa)
    {
        pc->next = NEW_NODE;
        pc->next->data = pa->data;
        pc->next->next = NULL;
        pa = pa->next;
        pc = pc->next;
    }
    while (pb)
    {
        pc->next = NEW_NODE;
        pc->next->data = pb->data;
        pc->next->next = NULL;
        pb = pb->next;
        pc = pc->next;
    }
}
```

#### 补充3 两个单链表的差集

```c
void ListDifference(LinkList La, LinkList Lb, LinkList Lc)
{
    LinkList pa = La->next, pb = Lb->next, pc = Lc;
    while (pa)
    {
        while (pa->data > pb->data && pb->next)
        {
            pb = pb->next;
        }
        if (pa->data != pb->data)
        {
            pc->next = NEW_NODE;
            pc->next->data = pa->data;
            pc->next->next = NULL;
            pc = pc->next;
        }
        pa = pa->next;
    }
}
```

