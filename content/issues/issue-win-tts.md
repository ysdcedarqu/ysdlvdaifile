---
title: "Qt Android TTS → Windows SAPI 引擎切换"
date: 2026-05-19
status: resolved
severity: 低
category: 跨平台
---

## 现象描述

AGVNav 从 Android 迁移至 Windows 桌面时，TTS 喊话功能无法使用。
Android 使用 `android.speech.tts.TextToSpeech` API，
Windows 无此接口。

## 解决方案

使用 Windows SAPI (Speech API) 替代：
- 通过 Qt `QProcess` 调用系统 `sapi.vbs` 脚本
- 或使用 `QTextToSpeech` 模块 (Qt 6.8 内置跨平台 TTS)
- `QTextToSpeech` 在 Windows 上自动选择 SAPI 引擎，在 Android 上选择 TTS 引擎

```cpp
QTextToSpeech *tts = new QTextToSpeech(this);
tts->setLocale(QLocale::Chinese);
tts->say("巡检完成");
```

## 进度

- [x] 方案调研
- [x] QTextToSpeech 跨平台实现
- [x] Windows/Android 双端验证
