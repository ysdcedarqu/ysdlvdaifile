---
title: "树莓派端口转发重启后丢失"
date: 2026-05-18
status: resolved
severity: 低
category: 运维
---

## 现象描述

树莓派重启后，iptables 端口转发规则丢失，导致海康摄像头 MJPEG 流 (:9990) 和巡检服务器
(:9998) 从外部无法访问。

## 解决方案

在 `start.sh` 启动脚本中增加 iptables 规则自动恢复逻辑：

```bash
# 检查并恢复端口转发
iptables -t nat -C PREROUTING -p tcp --dport 9990 -j DNAT --to :9990 2>/dev/null || \
  iptables -t nat -A PREROUTING -p tcp --dport 9990 -j DNAT --to-destination :9990
```

同时将 `start.sh` 加入 systemd 开机自启。

## 进度

- [x] 问题定位（重启后规则丢失）
- [x] start.sh 自动恢复脚本
- [x] systemd 服务配置
- [x] 重启验证（规则存活）
