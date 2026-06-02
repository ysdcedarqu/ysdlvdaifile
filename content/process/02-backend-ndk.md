---
title: "NDK适配与后端搭建"
phase: 2
date: 2026-05-11 ~ 05-17
status: completed
progress: 100
---

## 阶段目标

完成 Qt NDK r27c 编译适配，搭建树莓派统一控制中心，开发云台APP基础功能，启动 AGV 导航 APP。

## 关键交付物

- Qt 6.11→6.8.3 降级适配 + NDK r27c 编译通过
- 树莓派统一控制中心 v3.0.0 (FastAPI :5003)
- GPIO + PELCO-D + 音频 + 海康SDK 四大模块
- 云台APP: Bearer 认证 + data:URI 建图
- AGV 导航 APP 基础架构 (RobotAPI/NavigationEngine/AGVController)
- v0.2.0 后端发布标签
