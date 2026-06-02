---
title: "Redmi Android 15 无障碍服务概率性崩溃"
date: 2026-05-12
status: resolved
severity: 高
category: Android
---

## 现象描述

小米 (Redmi) 设备 Android 15 系统上，AccessibilityService 运行一段时间后概率性闪退，
`logcat` 显示主线程超时被系统 kill。

## 根因分析

`onAccessibilityEvent` 回调中同步执行了耗时操作（HTTP 网络请求），
导致主线程阻塞超过 5 秒触发 ANR，系统直接终止进程。

## 解决方案

1. 将 HTTP 请求逻辑移至后台协程 (`Dispatchers.IO`)
2. 回调中仅做事件类型判断与分发，不做阻塞操作
3. `onServiceConnected` 与 `onAccessibilityEvent` 之间的同步改用 `ConcurrentHashMap` + `AtomicBoolean`

## 进度

- [x] 日志分析 + ANR trace 定位
- [x] 协程化改造
- [x] 死锁修复（synchronized → ConcurrentHashMap）
- [x] Redmi 设备验证通过（24h 稳定性测试）
