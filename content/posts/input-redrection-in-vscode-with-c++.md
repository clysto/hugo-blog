---
title: "VS code C++ 程序调试重定向"
date: 2020-07-08T15:59:10+08:00
draft: false
---

> 检索了很久都是说直接在lanuch.json中设置args参数：
> 
> ```json
> {
>     "args": ["<", "input.txt"]
> }
> ```
> 
> 但是这样设置完了之后真的没用，在调试的时候依然会阻塞在输入的语句。

**正解：**


```json
{
    "setupCommands": [
        {
            "text": "settings set target.input-path ${workspaceFolder}/input"
        }
    ]
}
```

以上的命令其实就是在lldb启动时执行的lldb命令，将input文件重定向到程序中。
