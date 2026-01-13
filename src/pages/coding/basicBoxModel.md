---
title: CSS 基础认知： 盒模型
layout: "@/layouts/Post"
date: 2026-01-02
tags: blog
pin: false
language: 中文
categories:
  - 编程
label:
  - 原创
description:
  - 记录 CSS 盒模型相关知识点学习
---

## 一、基础盒模型结构

```html
<div class="box">Hello Box</div>
.box { width: 200px; height: 100px; padding: 20px; border: 10px solid red;
margin: 30px; background: lightblue; }
```

### 结论：

- 实际宽度 = width + padding*2 + border*2 + margin\*2
- 盒子宽度 = width + padding2 + border2

## 二、box-sizing

**CSS 加上 box-sizing**

```css
.box {
  box-sizing: border-box;
}
```

### 👀 观察发现:

- 内容区被“压缩”了
- 盒子总宽度被固定为 200 px

### 结论：

```
box-sizing: border-box
width = content + padding + border
```

## 三、基于上述的 1，2 点总结概述

在**默认盒模型(content-box)**下：width 只控制内容区（content）,padding 和 border 会额外把盒子撑大

加上 **border-box**,此时 **整个盒子宽度 = 200 px**, **content** 会被压缩为 200 - 40 -20 =140 px

## 四、margin 合并

```html
<div class="box box1"></div>
<div class="box box2"></div>

.box { height: 100px; } .box1 { margin-bottom: 50px; background: pink; } .box2 {
margin-top: 30px; background: orange; }
```

### 👀 观察发现：

间距：50 + 30 = 80 px ❌❌❌

✅**实际间距**： max(50,30) = 50 px ✅✅✅

### 结论：

垂直方向的 margin 会发生合并

## 五、inline 元素的盒模型是“残缺的”

```html
<span class="inline-box">inline</span> .inline-box { width: 200px; height:
100px; padding: 20px; margin: 20px; background: yellow; }
```

### 👀 观察发现：

- width / height 不生效
- padding 左右生效
- margin 上下效果不明显

### 结论：

inline 元素只有 **“部份盒模型”**

## 六、解释并扩展第五点

> **`span` 是 `display: inline` 元素，
> inline 元素不参与完整盒模型布局**

#### 1.要使样式生效，改为 inline-block

```css
span {
  display: inline-block;
}
```

inline-block 特点：

- ✅ 可以设置 width / height
- ✅ margin 上下生效
- ✅ 仍然在一行内排列

#### 2、为什么 inline 元素是 “残缺盒模型” ？

> **inline 元素是“文本流的一部分”，不是一个独立的布局盒子**

##### 两种布局机制:

1️⃣：**Block formatting context (块级排版)**

- div / p / h1
- 有明确的：
  - 宽
  - 高
  - 上下间距

2️⃣：**Inline formatting context(行内排版)**

- span / a / em

- 本质是：

  > **文字的一部分**

##### span 的 “尺寸”

> 由文本内容 + 字体决定

```
span 的高度 = 行高（line-height）
span 的宽度 = 文字实际占用宽度
```

#### 3、width / height 不生效

##### 原因：

- inline 元素 **不接受尺寸控制**
- 它不参与“盒子尺寸计算”

📌 正确理解：

> inline 元素只有“内容尺寸”，没有“盒子尺寸”

#### 4、 margin 上下效果没生效？

##### 实际情况是：

- margin **是生效的**
- 但 **不会撑开上下行距**

##### 为什么？

因为：

> 行内元素的上下空间，
> 由 **line-height** 决定，而不是 margin

#### 5、padding 效果

- 左右 padding 会推开文字 ✔️
- 上下 padding：
  - 视觉上有背景
  - **不影响行高**
