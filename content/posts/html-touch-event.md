---
title: "移动端触摸事件"
date: 2019-04-23T04:59:13.853Z
tags:
  - html
  - javascript
---



# 移动端触摸事件

最近在写一个博客后台的单页面应用，在文章列表这一个页面每一条文章都会拥有三个操作，“预览”， “编辑”， “删除”，在PC端，他们看上去是这个样子的，为了使移动端的控制台也更加优雅，我们使用html中的触摸事件对其优化。

<!--more-->

![PC.png](https://i.loli.net/2018/08/02/5b630ae1f3292.png)

在手机端展示的时候，就会显得很“挤”：

![mobile.png](https://i.loli.net/2018/08/02/5b630ae1b7b8b.png)

如果右侧的按钮改为左划呼出，那样的话，按钮区域就不会占用文字显示的空间，看上去也较为美观，先上成果图：

![slide-demo.gif](https://i.loli.net/2018/08/02/5b630ae256de5.gif)

想要达到这样的效果，就要了解一下``HTML DOM`` 事件对象中的touch事件。

我们先创建一个`<div></div>`，然后将event对象传进`touchstart()`这个函数，ontouchstart是一个DOM事件，当按下手指时，执行后面的函数：

```html
<div ontouchstart="touchstart(event)" id="demo">
    touch me!
</div>

<script>
    function touchstart(e) {
        console.log(e.touches[0]);   
        //touches是当前位于屏幕上的所有手指的一个列表
    }
</script>
```

打印出来的结果为一个对象：

|属性|值|
|-|-|
|clientX|141|
|clientY|60|
|force|1|
|identifier|0|
|pageX|141|
|pageY|60|
|radiusX|11.5|
|radiusY|11.5|
|rotationAngle:|0|
|screenX|548|
|screenY|198|
|target|div#demo|

其中一些属性的意义如下：

* clientX：触摸目标在视口中的x坐标
* clientY：触摸目标在视口中的y坐标
* identifier：标识触摸的唯一ID
* pageX：触摸目标在页面中的x坐标
* pageY：触摸目标在页面中的y坐标
* screenX：触摸目标在屏幕中的x坐标
* screenY：触摸目标在屏幕中的y坐标
* target：触摸的DOM节点目标

那么我们最需要的就是触摸目标在视口中的x坐标与y坐标，另外一些关于触摸的事件有：

* 移动手指时，触发ontouchmove
* 移走手指时，触发ontouchend

那么我们便可以监听这三个DOM事件，做一些有趣的操作~

做之前我们先加一点样式：

```css
#demo {
    position: absolute;
    width: 256px;
    height: 256px;
    color: #7d8d9b;
    background-color: #eef3f8;
    border-radius: 3px;
    text-align: center;
    line-height: 256px;
}
```

![添加样式.png](https://i.loli.net/2018/08/02/5b630bf2b51fd.png)

监听三个事件，并且添加一条内联样式，便于我们在js中获取。

```html
<div ontouchstart="touchstart(event)"
     ontouchmove="touchmove(event)"
     ontouchend="touchend(event)"
     id="demo"
     style="top: 15px; left: 15px"> //内联样式
    touch me!
</div>
```

接着我们通过js来实现用手指拖动这个`<div></div>`的效果。在开始之前，我们需要定义一些变量记录手指按下瞬间，触摸点在视口的位置，以及拖动的过程中，触摸点在视口的位置，还要记录下拖动前元素的`left`以及`top`属性的值，以便在拖动元素时，计算出两个方向的偏移量。

```javascript
var $demo = document.getElementById('demo');
var start_x,
    start_y,
    start_left,
    start_top,
    current_x,
    current_Y;
```

在`touchstart()`函数中，只需记录下相应触摸点的信息：

```js
function touchstart(e) {
    start_x = e.touches[0].clientX;
    start_y = e.touches[0].clientY;
    start_left = parseFloat($demo.style.left.replace('px', ''));
    start_top = parseFloat($demo.style.top.replace('px', ''));
}
```

在移动过程中我们获取移动过程中的触摸位置，并计算出偏移量，然后重新设置元素的`left`以及`top`属性的值，及触摸前的`left`或`top` + 移动过程中的偏移量，也就是`start_left/top` + `change_x/y`。

```js
function touchmove(e) {
    current_x = e.touches[0].clientX;
    current_y = e.touches[0].clientY;
    var change_x = current_x - start_x;
    var change_y = current_y - start_y;
    $demo.style.left = start_left + change_x + 'px';
    $demo.style.top = start_top + change_y + 'px';
}

function touchend(e) {
    $demo.innerHTML = '别摸我！';
}
```

**成果图：**

![demo.gif](https://i.loli.net/2018/08/02/5b630ae25297f.gif)

简单的通过控制DOM元素的`left`以及`top`样式就可以实现这个有趣的效果！那么回到开头的命题，有了这些基础我们怎样完成右划呼出菜单的设想呢？上面这个demo已经实现了元素的拖动，我们只需要x方向的拖动，并且在手指离开的瞬间需要对元素移动距离进行判断，符合一定条件就可以呼出控制区域。首先先写好我们的html模板：

**css样式：**

```css
* {
    box-sizing: border-box;
}

#slide-wrap {
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    overflow: hidden;
}

#slide-item {
    position: relative;
    display: flex;
    width: 100%;
}

.info {
    flex: 0 0 100%;
    font-size: 30px;
    font-weight: 300;
    padding: 30px 15px;
}

.btns {
    display: flex;
    flex: 0 0 211px;
}

.separation {
    width: 1px;
    height: 100%;
    background-color: #e1e7ec;
}

.del {
    color: #ffe2e2;
    background-color: #e66565;
}

button {
    flex: 1;
    border: none;
    color: #636569;
    background-color: #eef3f8;
    outline: none;
}
```

**html模板：**

```html
<div id="slide-wrap">
    <div id="slide-item">
        <div class="info">我是孤独的根号三</div>
        <div class="btns">
            <button>预览</button>
            <span class="separation"></span>
            <button>编辑</button>
            <button class="del">删除</button>
        </div>
    </div>
</div>
```

![模板1.png](https://i.loli.net/2018/08/02/5b630ae1cbacc.png)

关于`.info`样式的设定，有必要补充一点说明，`flex`属性是`flex-grow`，`flex-shrink`和`flex-basis` 属性的简写属性，而我们设置的`flex-shrink`为0，也就是元素不会收缩他的宽度，会按照`flex-basis`中设置的宽度来显示，所以三个按钮就会被“顶”到右侧。

```css
.info {
    flex: 0 0 100%; /* flex-grow|flex-shrink|flex-basis */
    font-size: 30px;
    font-weight: 300;
    padding: 30px 15px;
}
```

而外层元素`#slide-wrap`的`overflow`设为了hidden，所以按钮部分就会被修剪掉。

```css
#slide-wrap {
    border-top: 1px solid rgba(0, 0, 0, 0.07);
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    overflow: hidden;
}
```

如果我们将`.info`中的`flex-shrink`设置为1，也就是空间不足的时候会自动收缩，我们就能够看到三个按钮被显示出来了。

![模板2.png](https://i.loli.net/2018/08/02/5b630ae1cbd78.png)

当然我们不需要这样的显示方式，如果我们要以滑动的方式显示按钮，就需要改变`#slide-item`的`left`值，当我们将其设置为-211px时：

```html
<div id="slide-item" style="left: -211px">
......
</div>
```

右侧按钮被显示了，那我们只需要让js代替我们完成这个过程！

![left.png](https://i.loli.net/2018/08/02/5b630ae199cc4.png)

**监听触摸事件：**

```html
<div class="info"
     ontouchstart="touchstart(event)" 
     ontouchmove="touchmove(event)" 
     ontouchend="touchend(event)">我是孤独的根号三</div>
```

**操作样式：**

参照上一个demo的例子，将y方向移动的部分删去：

```javascript
var $ele = document.getElementById('slide-item');
var start_x,
    start_left,
    current_x;

function touchstart(e) {
    start_x = e.touches[0].clientX;
    start_left = parseFloat($ele.style.left.replace('px', ''));
}

function touchmove(e) {
    current_x = e.touches[0].clientX;
    var change_x = current_x - start_x;
    $ele.style.left = start_left + change_x + 'px';
}
```

![根号三.gif](https://i.loli.net/2018/08/02/5b630ae257b7d.gif)

但是当手指离开时，元素并没有回到它该去的地方，所以在`touchend()`函数中我们要加以判断：

```javascript
function touchend() {
    if (change_x < -70) {
        $ele.style.left = '-211px';
    } else {
        $ele.style.left = '0px';
    }
}
```

![V1.0.gif](https://i.loli.net/2018/08/02/5b630ae22a88a.gif)

动画效果太僵硬了，添加一点过度，最终的js代码为：

```javascript
var $ele = document.getElementById('slide-item');
var start_x,
    start_left,
    current_x,
    change_x;

function touchstart(e) {
    $ele.style.transition = 'left 0ms';
    start_x = e.touches[0].clientX;
    start_left = parseFloat($ele.style.left.replace('px', ''));
}

function touchmove(e) {
    current_x = e.touches[0].clientX;
    change_x = current_x - start_x;
    $ele.style.left = start_left + change_x + 'px';
}

function touchend(e) {
    $ele.style.transition = 'left 300ms';
    if (change_x < -70) {
        $ele.style.left = '-211px';
    } else {
        $ele.style.left = '0px';
    }
}
```

最终的效果为：

![V2.0.gif](https://i.loli.net/2018/08/02/5b630ae25238c.gif)

效果还不错哦(●'◡'●)，当然还有许多细节可以优化，大家也可以给我指出欠妥的地方~
