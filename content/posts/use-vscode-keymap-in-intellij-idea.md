---
title: "IntelliJ IDEA 使用 vscode keymap"
date: 2019-08-09T06:42:20.934Z
tags:
  - vscode
  - IDE
---

# IntelliJ IDEA 使用 vscode keymap

>平时使用Visual Studio Code较多，最近需要使用IntelliJ IDEA，可是我想保留在vscode上的快捷键映射，可是IntellJ IDEA的默认设置里没有提供vscode的选项。所以怎样在IntelliJ IDEA中使用 vscode keymap呢？

<!--more-->

通过Google我找到了[VS Code Keymap](https://plugins.jetbrains.com/plugin/12062-vs-code-keymap/)这个插件。一开始我在IntelliJ IDEA设置中的plugins中直接搜索这个插件的名字一直搜索不到，可能是代理的关系，在写这篇文章的时候又神奇的搜到了😂。								
![1565255020317.png](https://i.loli.net/2019/08/09/Ym9bVC12vJfdR5A.png)

但是当时我是直接在浏览器中下载然后选择Install Plugin from Disk加载到IntelliJ IDEA中。

![1565255158141.png](https://i.loli.net/2019/08/09/YTnC2z1HqLAW7oy.png)

之后在`File->Settings->Keymap`中选择VSCode，就切换成功了，本以为这样就结束了，没想到这个Keymap的`Tab`键在选择候选补全项目时神奇的失效了，只能通过`Enter`来选择补全内容。经过一顿查找后，在这个插件主页的评论区中找到了解决办法。

>Yeah, that tab keybinding thing is a pain. For anyone who needs to know how to fix it, the following worked for me. (On a mac) 1.) Command + Shift+ P -> type in "Manage Keymaps" and go there 2.) If you're using this plugin already, in the keymap dropdown there should be something like "VSCode", or "VSCode copy" in a dropdown window. Click on the small options button next to that. Depending on your version it might look like 3 dots. 3.) Click "Duplicate". Then, "Rename". Why do we have to do this? I read in the PHP docs that "You can modify a copy of any predefined keymap to assign your own shortcuts for commands that you use frequently." So I suppose we have to make a copy. I called mine "VSCode with tab". 4.) In the searchbar just type "tab", you should see the tab tag under "Editor Actions". 5.) Right click on "Tab" and select "Add Keyboard shortcut". 6.) Click the plus sign on the topmost box, and select the icon which looks like a little arrow to the right, (the one that means tab) 7.) select "Ok" and then "Apply". Wish I could have uploaded screen shots here, but I hope you have enough info to get this working.
>
>13.05.2019 by [Alexander McEvoy](https://plugins.jetbrains.com/author/9122de2c-022d-4fdc-80c7-591c4a5e0832)

> It works quite well although the TAB needs to be defined and also in "Choose Lookup Item" TAB needs to be added
>
> 02.05.2019 by [Joan Marcè Igual](https://plugins.jetbrains.com/author/6b8ad898-ce4b-40a0-896b-a73c13287585)

就是把"Choose Lookup Item"这个命令添加一个快捷键，在`File->Settings->Keymap`中将我们的VSCode Keymap复制一下然后查找"Choose Lookup Item"

![1565255772120.png](https://i.loli.net/2019/08/09/sQ5vneZya1lxGg4.png)

将快捷键更改为`Tab`就可以恢复`Tab`键的功能了。