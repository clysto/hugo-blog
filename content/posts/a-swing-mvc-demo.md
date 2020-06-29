---
title: "一个 Java Swing MVC DEMO"
date: 2020-02-25T15:43:00.524Z
tags:
  - java
  - mvc
---

# 一个 Java Swing MVC DEMO

MVC 模式是**Model-View-Controller**的简称，下面是一个计数器的例子。

比如下面的代码，为了增加一点复杂性我们的`Model`中有一个定时任务每隔一秒会将`time`属性+1，现在我们需要设计我们的 View 来展现`Model`中的数据。可以看到我们的`Model`继承了`Listenable`类，这个类给我们提供了两个重要的接口：

| 方法名                                               | 说明                                     |
| ---------------------------------------------------- | ---------------------------------------- |
| `void emit(String eventName)`              | 在其子类可以使用这个函数来释放一个事件   |
| `void on(String eventName, Runnable handler)` | 在其子类外部可以使用这个函数监听一个事件 |

> 注意`Listenable`类需要自己来编写，文末给出了实现，他非常简短却能大幅度的降低你的程序复杂性，你可以直接将他粘贴到你的工程中来使用。

<!--more-->

其实他的用法很简单，不要被吓到了，比如下面这个`Model`在 time++后就释放了一个叫做“time++”的事件。

```java
package demo;

import java.util.Timer;
import java.util.TimerTask;

public class Model extends Listenable {
    private int count;
    private int time;

    public Model() {
        new Timer().schedule(new Task(), 1000, 1000);
    }

    public void addCount() {
        count++;
    }

    public int getCount() {
        return count;
    }

    public int getTime() {
        return time;
    }

    private class Task extends TimerTask {
        @Override
        public void run() {
            time++;
            emit("time++");
        }
    }
}
```

> 释放这个事件后，你就可以使用下面这样的格式来监听事件的发生，每当“time++”，do something 就会执行。比较类似`TimerTask`。
>
> ```java
> Model model = new Model();
> model.on("time++", () -> {
>     // do something...
> });
> ```

接着我们定义一个`View`继承`JPanel`类，然后添加两个`JLabel`和一个`JButton`，并且设计一些常用的方法。

```java
package demo;

import javax.swing.*;

public class View extends JPanel {
    private JLabel label;
    private JButton button;

    public View() {
        label = new JLabel("");
        button = new JButton("add");
        add(label);
        add(button);
    }

    public JButton getButton() {
        return button;
    }

    public void setLabelText(String text) {
        label.setText(text);
    }

}
```

下面就是连接`View`和`Model`的`Controller`了，可以看到我们定义了`initView`和`initController`两个类来初始化。在`initController`方法中我们给`View`中的按钮添加了监听事件，当按钮被点击时就会被`Controller`监听到，然后根据按钮的意义来改变`Model`中的数据。MVC 的结构如下图

![image.png](https://i.loli.net/2020/02/26/hRz36ME4LlpmxOi.png)

`Model`从`Controller`接收命令和数据。 它存储这些数据并更新`View`。 `View`将`Model`提供的数据呈现给用户。`Controller`接受用户的输入，并将其转换为`Model`或`View`。

但是有些时候`Model`需要主动改变`View`那我们怎样实现呢？还记得刚才我们在`Model`中 emit 的“time++”事件吗？我们只需要在`Controller`中监听这个事件并且做出响应即可，这样的好处是避免了在`Model`中持有`View`，因为如果没有监听机制那么`Model`只能自己来调用`View`的方法来更新视图。那么就需要拿到`View`的引用。

```java
package demo;

public class Controller {
    private Model model;
    private View view;

    public Controller(Model model, View view) {
        this.model = model;
        this.view = view;
        initView();
    }

    public void initView() {
        view.setTextLabelText(model.getCount() + "");
    }

    public void initController() {
        model.on("time++", () -> {
            view.setTimeLabelText(model.getTime() + "");
        });
        model.on("time++", () -> {
            System.out.println(model.getTime());
        });
        view.getButton().addActionListener(e -> {
            model.addCount();
            view.setTextLabelText(model.getCount() + "");
        });
        // 上面写法等价下面写法，上面是匿名函数写法
        // view.getButton().addActionListener(this::onButtonClocked);
    }

    // private void onButtonClocked(ActionEvent actionEvent) {
    //     model.addCount();
    //     view.setLabelText(model.getCount() + "");
    // }
}
```

接着我们通过`main`函数启动我们的 swing 应用：

```java
package demo;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        View view = new View();
        Model model = new Model();
        Controller controller = new Controller(model, view);
        controller.initController();
        createWindow(view, "demo");
    }

    private static void createWindow(JPanel panel, String title) {
        JFrame frame = new JFrame(title);
        frame.setContentPane(panel);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(200, 200);
        frame.setVisible(true);
    }
}
```

我们现在给出`Listenable`类的实现：

```java
package demo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class Listenable {
    private Map<String, List<Runnable>> handlers = new ConcurrentHashMap<>();

    public void on(String eventName, Runnable handler) {
        List<Runnable> list = handlers.get(eventName);
        if (list != null) {
            list.add(handler);
        } else {
            list = Collections.synchronizedList(new ArrayList<>());
            list.add(handler);
            handlers.put(eventName, list);
        }
    }

    protected void emit(String eventName) {
        List<Runnable> list = handlers.get(eventName);
        if (list != null) {
            list.forEach(Runnable::run);
        }
    }
}
```
