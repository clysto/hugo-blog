---
title: "部署一个Minecraft服务器"
date: 2021-06-16T23:57:09+08:00
draft: false
---

使用 Docker 部署 Minecraft 服务器非常方便。

```yml
version: "3.8"

services:
  mc:
    image: itzg/minecraft-server
    ports:
      - 25565:25565
      - 25575:25575
    environment:
      EULA: "TRUE"
    volumes:
      - ./minecraft-data:/data
```

