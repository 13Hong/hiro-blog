---
title: 大文件分片上传：思路与实践
layout: "@/layouts/Post"
date: 2026-04-06
tags: blog
pin: false
language: 中文
categories:
  - 编程
label:
  - 原创
description:
  - 大文件上传自学demo
image:
  - "https://img.hiro7.info/images/bigFileUpload.png"
---

最近用 Vue 3 + Node.js 写了一个大文件上传的学习 Demo，顺便复习了 Node.js 文件系统。

## 为什么不能直接上传？

浏览器上传大文件（几百 MB）有两个致命问题：

1. **超时**：服务器/代理通常有请求时长限制，一次传完来不及
2. **失败成本高**：传到 99% 断网，只能从头再来

分片上传的思路就是：把大文件切成多个小块，分批上传，最后在服务端合并。失败了只需重传失败的那几片。

---

## 整体流程

```
前端                                    后端
 │ 1. 计算文件 MD5 → 作为 uploadId
 │ 2. POST /upload/init    ──────────►  创建临时目录 + 写入元信息
 │ 3. GET  /upload/status  ──────────►  返回已上传的分片序号列表
 │ 4. 过滤出未传的分片（断点续传）
 │ 5. 并发上传各分片
 │    POST /upload/chunk   ──────────►  将分片写入磁盘
 │ 6. POST /upload/merge   ──────────►  按顺序合并 → 完整文件
```

## 关键点拆解

### 1. 用文件 MD5 作为 uploadId

与其用文件名或时间戳，不如用文件内容的 MD5 哈希作为唯一 ID。好处是：

- **同一个文件永远是同一个 ID**，断点续传时能找回之前的进度
- 服务端发现 ID 对应文件已存在，可以直接返回（秒传）

MD5 计算是 CPU 密集操作，放在 **Web Worker** 里做，不卡主线程 UI。计算时不把整个文件读进内存，而是分块迭代、增量累积，内存友好。

### 2. 切片：用 File.slice()

`File` 继承自 `Blob`，调用 `.slice(start, end)` 即可按字节裁切，返回的还是 `Blob`，不会把文件内容全拉进内存。每个分片带上自己的序号（`index`），序号在最后合并时决定拼接顺序。

### 3. 断点续传：查状态 → 过滤 → 只传剩余

上传前先调 `/upload/status`，后端扫描临时目录，返回已成功落盘的分片序号列表。前端拿到列表后把这些序号过滤掉，只上传剩余的分片。

这就是断点续传的全部逻辑，没有任何黑魔法。

### 4. 并发控制

不能串行上传（太慢），也不能全部同时发（打爆连接数）。自实现了一个 `runWithConcurrency`，同时维持固定数量的"工人"（默认 4 个），每个工人完成一个任务后立即取下一个，自然实现负载均衡。

### 5. 暂停 / 继续

- **暂停**：每个分片请求都绑定同一个 `AbortSignal`，调用 `abort()` 统一中止所有进行中的请求
- **继续**：重新走一遍「查状态 → 过滤 → 上传」流程，已上传的自动跳过

### 6. 服务端合并

后端依赖纯 Node.js `fs` 模块：

- 接收分片时用 `fs.writeFileSync` 写入 `chunk-N.part`，已存在就跳过（幂等）
- 合并时按 `0 → N` 顺序依次把各 `.part` 文件追加写入最终文件，用 `WriteStream` 流式写，不占用大量内存

---

## 服务端目录结构

```
storage/
├── tmp/
│   └── {uploadId}/
│       ├── meta.json       ← 文件元信息（文件名、总分片数等）
│       ├── chunk-0.part
│       ├── chunk-1.part
│       └── ...
└── files/
    └── {uploadId}_{fileName}   ← 合并后的完整文件
```

---

> 完整代码：[big-file-upload-study](https://github.com/13Hong/big-file-upload)
