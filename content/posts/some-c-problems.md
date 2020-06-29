---
title: "C 语言经典题目"
date: 2019-04-21T14:37:00.257Z
tags:
  - c
  - 学习
---

# C 语言经典题目

包括一些 C 语言经典的题目，包括判断素数，进制转换，排序等题目。

<!--more-->

## 1.判断素数

```c
#include<stdio.h>
#include<math.h>
int fun (int t)
{
    int i;
    for (i=2; i<t; i++)
    {
        if (t%i==0)
            return 0;
    }
    return 1;
}

main ()
{
    int x;
    printf("input x:");
    scanf("%d",&x);
    printf("\nx = %d, x is a prime number, %d\n",x, fun(x));
    return 0;
}
```

## 2.排序（选择法，起泡法）

### 解法一

选择法

```c
#include<stdio.h>
#include<math.h>
void fun (int x[], int num)
{
    int i, j, k, t;
    for (i=0; i<num-1; i++)
    {
        k=i;
        for (j=i+1; j<num; j++)
        {
            if (x[k]>x[j])
                k=j;
        }
        t=x[k]; x[k]=x[i]; x[i]=t;
    }
}

main ()
{
    int i, a[10];
    printf("input array a: \n");
    for (i=0; i<10; i++)
        scanf("%d",&a[i]);
    fun(a, 10);
    for (i=0; i<10; i++)
        printf("%4d",a[i]);
    return 0;
}
```

### 解法二

起泡法

```c
#include<stdio.h>
#include<math.h>
void fun (int x[], int num)
{
    int i, j, t;
    for (i=0; i<num-1; i++)
    {
        for (j=0; j<num-1-i; j++)
        {
            if (x[j]>x[j+1])
            {
                t=x[j+1];
                x[j+1]=x[j];
                x[j]=t;
            }
        }
    }
}

main ()
{
    int i, a[10];
    printf("input array a: \n");
    for (i=0; i<10; i++)
        scanf("%d",&a[i]);
    fun(a, 10);
    for (i=0; i<10; i++)
        printf("%4d",a[i]);
    return 0;
}
```

## 3.函数递归调用求阶乘

```c
#include<stdio.h>
#include<math.h>
int fun (int t)
{
    int sum=1;
    if (t==1||t==0);
    else if (t>1)
        sum=fun(t-1)*t;
    return sum;
}

main ()
{
    int x;
    printf("input x: ");
    scanf("%d",&x);
    printf("\nx = %d, factorial of x is: %d\n",x,fun(x));
    return 0;
}
```

## 4.二分查找法

```c
#include<stdio.h>
#include<math.h>
int bin_search (int x[], int m, int key)
{
    int i, front=0, end=m-1, mid;
    while (front<=end)
    {
        mid=(front+end)/2;
        if (key<x[mid])
            end=mid-1;
        else if (key>x[mid])
            front=mid+1;
        else
            return mid;
    }
    return -1;
}

main ()
{
    int t=0, n, a[20]={1,3,5,8,12,23,34,37,38,40,42,48,50,57,60,63,69,75,80,84};
    printf("inter a number:\n");
    scanf("%d",&n);
    t=bin_search(a, 20, n);
    if (t>=0)
        printf("n exists in array a, the posion of n is: %d\n",t);
    else if (t==-1)
        printf("-1\n");
    return 0;
}
```

## 5.数组逆序存放

```c
#include<stdio.h>
#include<math.h>
void reverse (int x[], int m)
{
    int t[m], i;
    for (i=0; i<m; i++)
        t[i]=x[i];
    for (i=0; i<m; i++)
        x[i]=t[m-1-i];
}

main ()
{
    int i, a[10];
    printf("enter array a:\n");
    for (i=0; i<10; i++)
        scanf("%d",&a[i]);
    printf("\n");
    reverse(a, 10);
    for (i=0; i<10; i++)
        printf("%4d",a[i]);
    printf("\n");
    return 0;
}
```

## 6.成绩判断

```c
#include<stdio.h>
#include<math.h>
char fun (float s)
{
    char grade;
    int n=s/10;
    switch (n)
    {
        case 10:
            grade='A';
            break;
        case 9:
            grade='A';
            break;
        case 8:
            grade='B';
            break;
        case 7:
            grade='C';
            break;
        case 6:
            grade='D';
            break;
        default:
            grade='E';
    }
    return grade;
}

main ()
{
    float score;
    printf("input score:\n");
    scanf("%f",&score);
    printf("\ngrade = %c\n",fun(score));
    return 0;
}
```

## 7.字符串连接

```c
#include<stdio.h>
#include<string.h>
int str_cat (char x[], char y[])
{
    int i, n=strlen(x);
    x[n]=' ';
    for (i=0; i<10; i++)
        x[n+i+1]=y[i];
    return 0;
}

main ()
{
    char str1[20]="China", str2[10]="Nanjing";
    str_cat(str1, str2);
    puts(str1);
    return 0;
}
```

## 8.字符串统计

```c
#include<stdio.h>
#include<string.h>
int character_count (char x[], int y[])
{
    int i, n=strlen(x);
    for (i=0; i<n; i++)
    {
        if (x[i]>='0'&&x[i]<='9')
            y[0]++;
        else if (x[i]>='A'&&x[i]<='Z'||x[i]>='a'&&x[i]<='z')
            y[1]++;
        else if (x[i]==' ')
            y[2]++;
        else
            y[3]++;
    }
    return 0;
}

main ()
{
    char str1[80];
    int i, coun[4]={0};
    printf("enter a line of characters:\n");
    gets(str1);
    character_count(str1, coun);
    for (i=0; i<4; i++)
        printf("%d\n",coun[i]);
    return 0;
}
```

## 9.求最大公约数

### 解法一

更相减损术

```c
#include<stdio.h>
int main ()
{
    int m,n;
    scanf("%d",&m);
    scanf("%d",&n);
    int s=m*n;
    while(m!=n) m>n?(m=m-n):(n=n-m);
    int t=s/m;
    printf("最大公约数是%d\n",m);
    printf("最小公倍数是%d\n",t);
    return 0;
}
```

### 解法二

辗转相除法

```c
#include<stdio.h>
int main ()
{
    int a, b, c;
    scanf("%d %d", &a, &b);
    while(b!=0)
    {
        c=a%b;
        a=b;
        b=c;
    }
    printf("最大公约数是%d\n", a);
}
```
