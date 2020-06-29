---
title: "Pager.js"
date: 2019-04-23T05:01:38.122Z
tags:
  - html
  - javascript
---



# Pager.js

## 开始

> [tips]
>
> 这个小项目是基于jquery的，确保在开始之前已经正确加载了jquery.js。这个项目有助于我们更快的开发有翻页需求的页面。

<!--more-->

从实例化一个新的`pager`开始：

```js
var data = [1, 2, 3, 4];
var pager = new Pager('#pager-view’, data.length');
```

这里有两个必须的参数，pager所挂载dom节点的选择器‘#pager-view’和总共的页码数data.length。

当你实例化一个`pager`后还需规定dom节点的渲染规则，通过`pager.init(callback)`你可以规定每次页码变化时`pager`所挂载的dom节点的渲染规则，在callback中会传入三个参数：当前页码，最后一页页码以及`pager`所挂载的dom节点，我们需要在callback中规定渲染规则：

```js
var pagerender = function (currentpage, lastpage, el) {
    el.html(`
        <h1>这是第${data[currentpage - 1]}页</h1>
        <p>共${lastpage}页</p>
    `);
}
//执行初始化函数
pager.init(pagerender);
```

当`pager`初始化后你应该可以看到第一页被渲染出来了！

> [tips]
>
> 之所以在初始化函数中使用回调函数，是因为这样可以赋予用户更多权力去按照页码渲染相应的内容，你可以在回调函数中使用ajax或任何你想用的方法获取页码对应的数据，当然我们也可以运用迭代等方法重新组装数据进行渲染。

## 页码操纵

在`pager`初始化后你将拥有以下方法来操纵页码变化：

| 方法           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| nextpage()     | 页码跳转到下一页，并且调用一次pagerender()渲染视图，如果本页已经为最后一页，页码不会有任何变化 |
| previouspage() | 页码跳转到上一页，并且调用一次pagerender()渲染视图，如果本页已经为第一页，页码不会有任何变化 |
| goto(page)     | 跳转到指定的页码，如果该页码不存在， 页码不会有任何变化      |

*以上每一种方法均会返回跳转后的页码。*

通过按钮控制页码：

```js
$('#nextpage-btn').click(function () {
    pager.nextpage();
});
```

## 注意

当数据发生改变尤其是数据条目数变化时（数据的增加与删除）我们有必要执行pager.refresh(lastpage)函数来更新视图，refresh函数中需要传入数据更新完成后的总页码数，因为只有这样才能实时的加载对应页码的内容。

> [warn]
>
> 当执行完refresh函数后视图有可能发生改变也可能不改变，这要取决于数据条目更新时是否影响当前页的视图，举个最简单的例子：当我们删除若干条数据后，如果删除的数据位于当前页之后，那么视图将不会有变化，如果删除的数据位于当前页码之前，那么视图将会发生更新，甚至总页码数会发生改变，导致当前页读取不到任何数据，我们并不希望这样的事情发生，所以一定要在数据更新后执行refresh(lastpage)函数，告诉程序页码数是否变化，同时程序也会在当前页面不存在时自动跳转到正确的页码。

## demo

See the Pen [Pager.js-demo](https://codepen.io/clysto/pen/wEwdEq/) by 毛亚琛 ([@clysto](https://codepen.io/clysto)) on [CodePen](https://codepen.io/).

## 源码

```js
$(function () {
    'use strict';

    window.Pager = function (el, lastpage) {
        this.page = 1;
        this.lastpage = lastpage;
        this.$ele = $(el); //pager所挂载的dom节点

        this.init = function (callback) {
            this.pagerender = callback;
            this.pagerender(this.page, this.lastpage, this.$ele);
            return this.page;
        }

        this.goto = function (page) {
            if (!(page >= 1 && page <= this.lastpage)) return;
            this.page = page;
            this.pagerender(this.page, this.lastpage, this.$ele);
            return this.page;
        }

        this.refresh = function (num) {
            if (num == 0 || num) {
                num = num;
            } else {
                num = this.lastpage;
            }
            if (num < 0) return;
            this.lastpage = num;
            if (this.lastpage < this.page) {
                this.page = this.lastpage;
            }
            this.pagerender(this.page, this.lastpage, this.$ele);
            return this.page;
        }

        this.nextpage = function () {
            if (!(this.page + 1 >= 1 && this.page + 1 <= this.lastpage)) return;
            this.page++;
            this.pagerender(this.page, this.lastpage, this.$ele);
            return this.page;
        }

        this.previouspage = function () {
            if (!(this.page - 1 >= 1 && this.page - 1 <= this.lastpage)) return;
            this.page--;
            this.pagerender(this.page, this.lastpage, this.$ele);
            return this.page;
        }
    }
});
```