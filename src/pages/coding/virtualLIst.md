---
title: 面试题：页面一次性渲染 10 万条数据，如何保证不卡顿?
layout: "@/layouts/Post"
date: 2026-01-21
tags: blog
pin: false
language: 中文
categories:
  - 编程
label:
  - 原创
description:
  - 面试题巩固
---

刷到一个高频面试题：**在页面内一次性渲染 10 万条记录，怎么保证页面不卡顿、滚动不卡顿？**

我就是要把这 10 万条数据直接通过 `v-for` 渲染出来，会发生什么？

### 直接渲染 10 万条数据

```ts
<script setup lang="ts">
import { computed } from "vue";

type Row = { id: number; text: string };

const list = computed<Row[]>(() => {
  // 模拟 10 万条
  return Array.from({ length: 100000 }, (_, i) => ({
    id: i + 1,
    text: `第 ${i + 1} 条记录`
  }));
});
</script>

<template>
  <div style="height: 600px; overflow: auto; border: 1px solid #ddd;">
    <div v-for="item in list" :key="item.id" style="padding: 8px 12px; border-bottom: 1px solid #eee;">
      {{ item.text }}
    </div>
  </div>
</template>
```

**会发现：**

- 首次渲染很慢，卡住几秒甚至更久
- 滚动会卡顿掉帧，滚动了迟钝了几秒才正常

### 为什么会卡？

渲染 10 万条的真正成本在于：**创建并维护 10 万个 DOM 节点（以及它们的样式、布局、绘制）**。

- DOM 节点数量过多，会导致巨大的内存占用。
- 节点越多，越容易触发更重的 Layout/Paint，滚动时也更容易掉帧

### 虚拟列表实现

```ts
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

type Row = { id: number; text: string };

// 模拟 10 万条数据
const data = ref<Row[]>(
  Array.from({ length: 100000 }, (_, i) => ({
    id: i + 1,
    text: `第 ${i + 1} 条记录`
  }))
);

const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);

const itemHeight = 36;     // 每行固定高度
const buffer = 6;          // 上下缓冲，避免快速滚动白屏
const containerHeight = ref(600); // 容器高度（也可动态测量）

onMounted(() => {
  // 可选：动态拿容器高度（更通用）
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
  }
});

const totalHeight = computed(() => data.value.length * itemHeight);

const visibleCount = computed(() =>
  Math.ceil(containerHeight.value / itemHeight)
);

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
);

const endIndex = computed(() =>
  Math.min(
    data.value.length,
    startIndex.value + visibleCount.value + buffer * 2
  )
);

const visibleList = computed(() =>
  data.value.slice(startIndex.value, endIndex.value)
);

const offsetY = computed(() => startIndex.value * itemHeight);

function onScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop;
}
</script>

<template>
  <div
    ref="containerRef"
    @scroll="onScroll"
    style="height: 600px; overflow: auto; border: 1px solid #ddd;"
  >
    <!-- 1) 占位：撑起总高度，让滚动条看起来是 10 万条 -->
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <!-- 2) 实际渲染层：只渲染可视区 -->
      <div
        :style="{
          position: 'absolute',
          left: 0,
          right: 0,
          transform: `translateY(${offsetY}px)`
        }"
      >
        <div
          v-for="item in visibleList"
          :key="item.id"
          :style="{
            height: itemHeight + 'px',
            lineHeight: itemHeight + 'px',
            padding: '0 12px',
            borderBottom: '1px solid #eee',
            boxSizing: 'border-box'
          }"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: 8px; color: #666; font-size: 12px;">
    渲染区间：{{ startIndex }} ~ {{ endIndex }}（实际渲染 {{ endIndex - startIndex }} 条）
  </div>
</template>
```

**当然也有现成的库可用，vue3可用库：vue3-virtual-scroller 或组件库自带 VirtualList**

### 为什么虚拟列表能解决卡顿？

虚拟列表 DOM 数量就维持在**几十条**，保证可视区域和缓冲区的数据即可。滚动的时候，替换可视区数据，DOM 数量不变。

即：虚拟列表不是“让 10 万条渲染更快”，而是**让页面永远只渲染你看得见的那一小部分**。
