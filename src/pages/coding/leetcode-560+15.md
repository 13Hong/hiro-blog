---
title: leetcode:560 + 15
layout: "@/layouts/Post"
date: 2026-01-17
tags: blog
pin: false
language: 中文
categories:
  - 编程
label:
  - 原创
description:
  - leetcode 刷题 560+15
---

## 一、3Sum

Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.
给定一个整数数组 nums，返回所有满足以下条件的三元组 `[nums[i], nums[j], nums[k]]` ： `i != j` , `i != k` , 且 `j != k` , 且 `nums[i] + nums[j] + nums[k] == 0` 。

Notice that the solution set must not contain duplicate triplets.
注意，解集中不能包含重复的三元组。

**Example 1: 例 1：**

```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation:
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.
```

**Example 2: 示例 2：**

```
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.
```

**Example 3: 示例 3：**

```
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.
```

**Constraints: 限制：**

- `3 <= nums.length <= 3000`
- `-105 <= nums[i] <= 105`

### 核心思路📖：

排序 + 双指针

1. 排序 （更好的去重）
2. 枚举第一个数的下标 i
3. 用 i 右侧用 双指针 找另外两个数
4. 根据 `sum = nums[i] + nums[left] + nums[right]` 调整指针：
   - `sum < 0` → `left++`（需要更大）
   - `sum > 0` → `right--`（需要更小）
   - `sum == 0` → 记录答案，左右指针同时收缩继续找

**去重：**

`if (i > 0 && nums[i] === nums[i - 1]) continue;`

`while (left < right && nums[left] === nums[left - 1]) left++;`
`while (left < right && nums[right] === nums[right + 1]) right--;`

**剪枝:(减少无意义的双指针扫描)**

- **最小和剪枝**：当前 `i` 最小的三数和都大于 0，则后面不可能再出现 0，直接 `break`
  `nums[i] + nums[i+1] + nums[i+2] > 0`
- **最大和剪枝**：当前 `i` 最大的三数和都小于 0，则这个 `i` 不可能成解，`continue`
  `nums[i] + nums[n-2] + nums[n-1] < 0`

### 示例答案✅：

```ts
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    // 去重：固定数 i 不能重复
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // 剪枝1：最小三数和都大于 0，后面只会更大，直接结束
    if (nums[i] + nums[i + 1] + nums[i + 2] > 0) break;

    // 剪枝2：最大三数和都小于 0，这个 i 不可能成解，换下一个 i
    if (nums[i] + nums[n - 2] + nums[n - 1] < 0) continue;

    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        res.push([nums[i], nums[left], nums[right]]);

        left++;
        right--;

        // 去重：left/right 跳过重复值
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      }
    }
  }

  return res;
}
```

## 二、Subarray Sum Equals K

Given an array of integers `nums` and an integer `k`, return _the total number of subarrays whose sum equals to_ `k`.
给定一个整数数组 `nums` 和一个整数 `k` ，返回和等于 `k`_​​的子数组的总数_ 。

A subarray is a contiguous **non-empty** sequence of elements within an array.
子数组是数组中连续的**非空**元素序列。

**Example 1: 例 1：**

```
Input: nums = [1,1,1], k = 2
Output: 2
```

**Example 2: 示例 2：**

```
Input: nums = [1,2,3], k = 3
Output: 2
```

**Constraints: 限制：**

- `1 <= nums.length <= 2 * 104`
- `-1000 <= nums[i] <= 1000`
- `-107 <= k <= 107`

### 核心思路📖：

**核心公式：**

子数组 `[l..r]` 的和：

```
sum(l..r) = pre[r] - pre[l-1]
```

要等于 `k`：

```
pre[r] - pre[l-1] = k
=> pre[l-1] = pre[r] - k
```

所以我们每次在 r 位置，会去找：

```
need = pre[r] - k
```

看看以前有没有出现过 `need` 这个前缀和。

1. 定义前缀和 pre 和 count 计数
2. 初始化map （存的是某个前缀出现的次数）
3. 结合上述公式，当我遍历 r 时，只要知道之前出现过多少次前缀和等于 pre[r] - k，就有多少个子数组以 r 结尾、和为 k。

### 示例答案✅：

```ts
function subarraySum(nums: number[], k: number): number {
  const map = new Map<number, number>();
  map.set(0, 1);

  let pre = 0;
  let count = 0;

  for (const x of nums) {
    pre += x;

    const need = pre - k;
    if (map.has(need)) count += map.get(need)!;

    map.set(pre, (map.get(pre) ?? 0) + 1);
  }

  return count;
}
```
