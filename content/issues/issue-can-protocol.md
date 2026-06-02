---
title: "CAN 底盘驱动协议编码 Bug (v2.0.0修复)"
date: 2026-05-27
status: resolved
severity: 高
category: 硬件驱动
---

## 现象

TK-mid 履带底盘在运动学控制模式下，发送速度指令后底盘偶尔无响应或运动方向错误。
CAN 总线抓包发现部分指令帧 CRC 校验失败。

## 根因

v1.x 版本中 CAN 帧协议编码使用了大端序 (big-endian) 打包速度/角度浮点数，
而 TK-mid 底盘固件实际期望小端序 (little-endian)。在特定速度值下导致字节序错误。

## 解决方案

v2.0.0 修复:
- `struct.pack` 格式从 `>ff` 改为 `<ff`
- 增加协议编码单元测试 (`test_protocol.py`)
- 全速度范围验证 (-1.0 ~ 1.0 m/s)

## 进度

- [x] CAN 抓包与协议分析
- [x] 字节序修复
- [x] 单元测试覆盖
- [x] v2.0.0 PyPI 发布
