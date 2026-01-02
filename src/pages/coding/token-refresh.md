---
title: 前端 Token 刷新机制实战：基于 Axios 的 accessToken 自动续期方案
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
  - 记录基于 Axios 的 accessToken 自动续期实战
image:
  - "https://img.hiro7.info/images/token_FlowChart.png"
---

## 一、背景

在前后端分离的项目中，前端通常通过 `accessToken` 来访问业务接口。
但由于 `accessToken` 有有效期限制，过期后的处理方式，直接影响系统的**安全性**和**用户体验**。

本文将介绍一种 **基于 Axios 响应拦截器 + 请求队列** 的 Token 自动刷新方案，适用于实际生产环境。

## 二、整体设计思路

核心目标只有三个：

1. **accessToken 过期时自动刷新**
2. **refreshToken 只请求一次**
3. **刷新完成后自动重试过期前的请求**

## 三、基于业务 code 的统一错误抛出

项目中后端返回统一的数据结构：

```ts
{
  code: number;
  msg: string;
  data: any;
}
```

在 Axios 的响应拦截器的 **成功回调** 中：

```ts
if (code === ApiCodeEnum.SUCCESS) {
  return data;
}

// 业务错误，主动抛出
ElMessage.error(msg || "系统出错");
return Promise.reject(new Error(msg || "Error"));
```

- 成功流只处理 **真正成功的数据**
- 所有业务异常 **统一进入 error 分支**
- 后续逻辑更清晰、集中

## 四、在 error 分支中统一处理 Token 异常

在 Axios 响应拦截器的 error 回调中：

```ts
async (error) => {
  const { response, config } = error;

  if (!response) {
    ElMessage.error("网络连接失败");
    return Promise.reject(error);
  }

  const { code, msg } = response.data;

  switch (code) {
    case ApiCodeEnum.ACCESS_TOKEN_INVALID:
      return refreshTokenAndRetry(config, service);

    case ApiCodeEnum.REFRESH_TOKEN_INVALID:
      await redirectToLogin("登录已过期");
      return Promise.reject(error);

    default:
      ElMessage.error(msg || "系统出错");
      return Promise.reject(error);
  }
};
```

### 设计要点

- **只在一个地方判断 Token 失效**
- 不在业务代码中关心 Token 状态

## 五、Token 刷新的难点：并发请求问题

如果多个接口同时返回 `ACCESS_TOKEN_INVALID`：

- ❌ 会触发多次 refreshToken 请求
- ❌ 后端压力大
- ❌ Token 状态混乱

**解决方案：请求队列 + 刷新锁**

## 六、基于闭包的 Token 刷新队列实现

通过组合式函数 `useTokenRefresh` 实现：

### 核心状态

```ts
let isRefreshingToken = false;
const pendingRequests = [];
```

### 刷新 Token 并重试请求

```ts
async function refreshTokenAndRetry(config, httpRequest) {
  return new Promise((resolve, reject) => {
    const retryRequest = () => {
      const newToken = AuthStorage.getAccessToken();
      config.headers.Authorization = `Bearer ${newToken}`;
      httpRequest(config).then(resolve).catch(reject);
    };

    pendingRequests.push({ resolve, reject, retryRequest });

    if (!isRefreshingToken) {
      isRefreshingToken = true;

      useUserStoreHook()
        .refreshToken()
        .then(() => {
          pendingRequests.forEach((req) => req.retryRequest());
          pendingRequests.length = 0;
        })
        .catch(async () => {
          pendingRequests.forEach((req) =>
            req.reject(new Error("Token refresh failed"))
          );
          pendingRequests.length = 0;
          await redirectToLogin("登录已失效");
        })
        .finally(() => {
          isRefreshingToken = false;
        });
    }
  });
}
```

## 七、为什么要提前初始化刷新函数？

> 在创建 Axios 函数中要提前初始化刷新函数

```ts
const { refreshTokenAndRetry } = useTokenRefresh();
```

### 原因

- 利用 **闭包** 保存刷新状态
- 确保所有请求共享：
  - `isRefreshingToken`
  - `pendingRequests`
- 防止重复刷新

## 完整代码示例

```ts
import type { InternalAxiosRequestConfig } from "axios";
import { useUserStoreHook } from "@/store/modules/user.store";
import { AuthStorage, redirectToLogin } from "@/utils/auth";

/**
 * 等待请求的类型接口
 */
type PendingRequest = {
  resolve: (_value: any) => void;
  reject: (_reason?: any) => void;
  retryRequest: () => void;
};

/**
 * Token刷新组合式函数
 */
export function useTokenRefresh() {
  // Token 刷新相关状态s
  let isRefreshingToken = false;
  const pendingRequests: PendingRequest[] = [];

  /**
   * 刷新 Token 并重试请求
   */
  async function refreshTokenAndRetry(
    config: InternalAxiosRequestConfig,
    httpRequest: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // 封装需要重试的请求
      const retryRequest = () => {
        const newToken = AuthStorage.getAccessToken();
        if (newToken && config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
        httpRequest(config).then(resolve).catch(reject);
      };

      // 将请求加入等待队列
      pendingRequests.push({ resolve, reject, retryRequest });

      // 如果没有正在刷新，则开始刷新流程
      if (!isRefreshingToken) {
        isRefreshingToken = true;

        useUserStoreHook()
          .refreshToken()
          .then(() => {
            // 刷新成功，重试所有等待的请求
            pendingRequests.forEach((request) => {
              try {
                request.retryRequest();
              } catch (error) {
                console.error("Retry request error:", error);
                request.reject(error);
              }
            });
            // 清空队列
            pendingRequests.length = 0;
          })
          .catch(async (error) => {
            console.error("Token refresh failed:", error);
            // 刷新失败，先 reject 所有等待的请求，再清空队列
            const failedRequests = [...pendingRequests];
            pendingRequests.length = 0;

            // 拒绝所有等待的请求
            failedRequests.forEach((request) => {
              request.reject(new Error("Token refresh failed"));
            });

            // 跳转登录页
            await redirectToLogin("登录状态已失效，请重新登录");
          })
          .finally(() => {
            isRefreshingToken = false;
          });
      }
    });
  }

  return {
    refreshTokenAndRetry,
  };
}
```
