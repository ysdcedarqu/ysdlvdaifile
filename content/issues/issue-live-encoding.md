---
title: "快直播推流 FFmpeg 编码参数调优"
date: 2026-05-28
status: resolved
severity: 中
category: 视频直播
---

## 背景

快直播推流初期使用 FFmpeg 默认编码参数 (preset=medium, GOP=60)，端到端延迟达 5 秒以上，无法满足远程巡检实时监控要求。

## 优化过程

| 轮次 | 调整项 | 延迟 | 问题 |
|------|--------|------|------|
| 第1轮 | preset: medium→fast | 5s→3s | B帧仍导致缓冲 |
| 第2轮 | 禁用B帧 (-bf 0) | 3s→2s | GOP过大等待久 |
| 第3轮 | GOP: 60→30 | 2s→1.2s | 编码缓冲仍有 |
| 第4轮 | preset→ultrafast + tune→zerolatency | 1.2s→0.8s | ✅ 达标 |

最终参数组合: ultrafast + zerolatency + baseline + GOP 30 + 无B帧

## 进度

- [x] 参数逐项测试与对比
- [x] 最终参数组合确定
- [x] 实机验证 (USB摄像头 + 树莓派)
- [x] 文档记录 (WEBRTC_README.md)
