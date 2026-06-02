---
title: "Qt 6.11 与 NDK r27c 编译不兼容"
date: 2026-05-11
status: resolved
severity: 高
category: 构建环境
---

## 现象描述

使用 Qt 6.11 + NDK r27c 编译 Android 项目时链接失败，`libc++_shared.so` 部分符号未定义。

## 影响范围

- 所有 Qt for Android 子项目无法编译通过
- 阻塞整个安卓开发流程

## 解决方案

降级至 Qt 6.8.3 LTS 版本，该版本经测试与 NDK r27c 完全兼容。
同时 JDK 从 11 升级至 OpenJDK 17（Qt 6.8 最低要求）。

## 进度

- [x] 问题定位（NDK ABI 符号缺失）
- [x] Qt 6.8.3 安装与配置
- [x] android_arm64_v8a 工具链验证
- [x] 全部子项目编译通过
