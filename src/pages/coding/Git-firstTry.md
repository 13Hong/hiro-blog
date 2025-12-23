---
title: Git:新建功能分支并解决 Merge 冲突
layout: "@/layouts/Post"
date: 2025-12-23
tags: blog
pin: false
language: 中文
categories:
  - 编程
label:
  - 原创
description:
  - 记录从新建功能分支到合并主分支并解决冲突的完整 Git 使用流程
image:
  - "https://avatars.githubusercontent.com/u/18133?s=200&v=4"
---

最近在给自己的博客项目增加 **中英文切换（i18n）功能**，顺便走一遍从新建功能分支 -> 开发提交 -> 合并回主分支 -> 解决冲突 -> 推送远端。

## 一、新建功能分支（feature/i18n）

在新建分支之前，我先确保主分支是最新的：

```
git checkout main
git pull
```

然后创建并切换到功能分支：

```
git checkout -b feature/i18n
```

> **分支并不是拷贝文件，而是一条独立的时间线。**

接下来，所有和 i18n 相关的开发都会在这个分支上完成。

## 二、在新分支人为添加冲突

```
-- main分支/xxx.vue
console.log('main分支')

-- feature/i18n分支/xxx.vue
console.log('feature/i18n分支')

```

## 三、在功能分支上开发并提交

在 `feature/i18n` 分支上完成阶段性开发后，我进行了正常的提交：

```
git add .
git commit -m "feat: add basic i18n support"
```

第一次把这个分支推到远端时，需要加上 `-u`：

```
git push -u origin feature/i18n
```

这样可以建立本地分支和远端分支的追踪关系，之后只需要：

```
git push
```

## 四、合并回 main 分支，遇到冲突

功能完成后，我准备把代码合并回 `main`：

```
git checkout main
git pull
git merge feature/i18n
```

这时 Git 提示出现冲突，例如：

```
CONFLICT (content): Merge conflict in xxx.vue
```

## 五、解决冲突的步骤

1.  打开冲突文件
2.  理解两个分支代码的差异
3.  保留正确的逻辑
4.  保存文件

然后执行：

```
git add .
```

这一步非常关键，它的含义是：

> **告诉 Git：这些冲突我已经手动解决完了**

## 六、完成 merge commit（一个容易踩坑的点）

解决冲突后，我执行了：

```
git commit
```

这时 Git 打开了编辑器（Vim），让我确认提交信息。

后来我才明白，在 merge 冲突场景下，更推荐直接使用：

```
git commit --no-edit
```

它的含义是：

> **直接使用 Git 自动生成的 merge 提交信息，不打开编辑器**

这一步完成后，merge commit 只存在于**本地 main 分支**。

## 七、提交到远程分支

```
git push
```

只有执行了 `git push`：

- merge commit 才会出现在远端
- GitHub 上的 `main` 分支才会更新
- 功能才算真正合并完成

## 八、总结

这次并没有用到多么高级的 Git 技巧，只是记录从
**分支创建 → 功能开发 → 合并 → 冲突解决 → 推送远端**

> 本次实践让我第一次把 Git 的分支开发和冲突处理流程真正串联起来。  
> 把这些过程记录下来，一方面是对自己学习轨迹的梳理，另一方面也希望逐步积累技术表达的能力。  
> 这篇文章算是一个起点，为后续系统性地撰写技术文章打下基础。
