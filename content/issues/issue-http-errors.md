---
title: "HTTP API 调用 400/401/405 错误排查"
date: 2026-05-13
status: resolved
severity: 中
category: 后端联调
---

## 现象描述

AGV 导航 APP 调用机器人 HTTP API 时出现多种 HTTP 错误：
- 400 Bad Request
- 401 Unauthorized  
- 405 Method Not Allowed

## 根因分析

| 错误码 | 根因 | 发现方法 |
|--------|------|----------|
| 400 | POST 空 body 但误设了 `Content-Type: application/json` | `curl -v` 对比有无 Content-Type |
| 401 | `Authorization: {token}` 缺少 `Bearer ` 前缀 | curl 逐格式测试 |
| 405 | `async_stop_scan_map` 用 POST 调用，实际接口只接受 GET | `curl -X GET` vs `-X POST` |

## 解决方案

1. GET 请求和空 body POST 不设置 Content-Type 头
2. 统一使用 `Authorization: Bearer {token}` 格式
3. 建立 curl 先行验证流程：PC 端逐一测试 → 确认 HTTP 方法和返回格式 → 再写 C++ 代码

## 进度

- [x] 全部 API 端点 curl 验证
- [x] Qt C++ 侧修复 (QNetworkRequest Header 修正)
- [x] `API_DOC.md` 标注每个端点正确 HTTP 方法
