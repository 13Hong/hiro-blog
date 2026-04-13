---
title: Git 学习笔记
layout: "@/layouts/Post"
date: 2026-04-13
tags: blog
pin: false
language: 中文
categories:
  - 编程
label:
  - 原创
description:
  - 记录 Git 学习
image:
  - "https://img.hiro7.info/images/2.png"
---

### 前言

最近在维护一个学习用的 Vue3 项目时，遇到了两个典型的 Git 问题：

1. 我已经 push 了两条 commit 到远程，后来发现其实可以合并成一条更干净的记录。
2. 本地仓库是几个月前的老版本，本地 commit 了两次没 push，结果远程仓库被作者 force push 过，导致 git pull 直接报 divergent branches，完全拉不下来。

下面把两次解决过程完整记录下来，方便以后自己复习，也给同样踩坑的朋友参考。

---

### 一、已 push 的两条 commit，如何合并成一条干净记录？

**场景**： 我本地连续 commit 了两次（比如一次改标题、一次去除无用信息），已经 git push 上去。之后发现这两条 commit 其实可以合并成一条更清晰的记录。

**目标🎯：**

<img src="https://img.hiro7.info/images/1.png" alt="1.png (2732×846)" style="zoom: 33%;" />

<img src="https://img.hiro7.info/images/2.png" alt="1.png (2732×846)" style="zoom:33%;" />

**解决思路**：

- 使用 git reset --soft 把两条 commit “撤回”，但保留所有代码修改。
- 重新 commit 成一条干净的记录。
- 因为历史已经被改写，必须用 force push 把远程分支的引用指向新的 commit（旧的 commit 只是失去引用，并非真正删除）。

**完整操作步骤**：

```
# 1. 先确认当前历史
git log --oneline --graph -5

# 2. 用 --soft 模式撤回最近两条 commit（修改保留在暂存区）
git reset --soft HEAD~2

# 3. 重新提交成一条干净的 commit
git commit -m "feat: 合并配置修改和测试代码优化"

# 4. 强制推送
git push --force-with-lease origin master
# 或者 git push -f origin master
```

**执行后效果**：

- 远程仓库的 Commits 页面只剩下一条新的合并 commit。
- 原来的两条旧 commit 不再被 master 分支引用，从主历史中消失（但 GitHub 服务器短期内可能还保留）。
- 本地和远程历史保持一致，干净清晰。

---

### 二、本地老仓库 + 远程被 force push，如何快速跟上最新代码？

**场景**：

- 本地是几个月前的 clone 版本，还在 master 分支上自己 commit 了两次（没 push）。
- 这期间项目作者对 master 进行了 force push（重写了历史）。
- 执行 git pull 直接报错：

```
hint: You have divergent branches...
fatal: Need to specify how to reconcile divergent branches.
```

**核心原因**： 本地和远程的历史从某个老 commit 开始就“分叉”了（diverged），加上远程做了 forced update，Git 新版本默认不再自动合并，要求手动指定。

**目标**： **只想拿到最新的远程代码，完全不在意本地那两个旧 commit**。

**解决办法**：

```
# 1. 先拉取远程最新内容（只下载，不合并）
git fetch origin

# 2. 强制把本地 master 重置为远程最新状态
git reset --hard origin/master

# 3. 检查状态
git status
```

执行完后：

- 本地所有文件都会被更新成 远程仓库 上最新的代码。
- 本地那两个旧 commit 被彻底丢弃。

### 总结

- **git reset --soft**：撤回 commit 但保留修改
- **git reset --hard origin/分支**：当本地和远程严重分叉时，这是最快速、最干净的“丢弃本地历史、跟上远程最新”的方式。
