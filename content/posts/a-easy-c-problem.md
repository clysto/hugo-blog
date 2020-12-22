---
title: "A Easy C Problem"
date: 2020-12-09T17:10:09+08:00
draft: false
tags: ["C"]
keywords: ["C"]
---

今天考试这道如此简单的题竟然没有做出来。。。。。。希望下一次我可以记住。

<!--more-->

```c
#include <stdio.h>
#include <stdlib.h>

int have_person(int *list, int size) {
  for (int i = 0; i < size; i++) {
    if (list[i] > 0) {
      return 1;
    }
  }
  return 0;
}

int next(int *list, int size, int p) {
  int n = (p + 1) % size;
  while (list[n] == -1) {
    n = (n + 1) % size;
  }
  return n;
}

void print_list(int *list, int size) {
  for (int i = 0; i < size; i++) {
    printf("%2d ", list[i]);
  }
  printf("\n");
}

int main(void) {
  int m, n;
  scanf("%d", &n);
  scanf("%d", &m);
  int *list = (int *)malloc(sizeof(int) * n);
  int p = 0;
  for (int i = 0; i < n; i++) {
    list[i] = i + 1;
  }
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < m - 1; j++) {
      p = next(list, n, p);
    }
    printf("%d\n", p + 1);
    list[p] = -1;
  }
  printf("%d\n", p + 1);
  return 0;
}
```
