---
title: "激光雷达ROS驱动时间戳偏移"
date: 2026-04-15
status: resolved
severity: 中
category: 软件
---

## 现象描述

激光雷达点云与 IMU 数据时间戳存在 ~50ms 偏移，影响 SLAM 精度。

## 解决方案

在 ROS 节点中增加硬件时钟同步机制，使用 PTP 协议对齐时间戳。

## 进度

- [x] 问题定位
- [x] PTP 时间同步实现
- [x] 实机验证通过
