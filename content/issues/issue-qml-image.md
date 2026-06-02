---
title: "QML Image 无法显示建图图片 (Android file:// 限制)"
date: 2026-05-14
status: resolved
severity: 中
category: Qt/QML
---

## 现象描述

服务端返回建图 PNG 图片后，客户端写入本地文件再用 `file://` URL 传给 QML `Image` 组件，
图片无法显示，无任何报错。

## 根因分析

Android 沙箱安全策略：应用私有目录中的文件无法通过 `file://` 协议被 QML 引擎访问。
`QQmlFileSelector` 在 Android 上对本地文件协议有额外限制。

## 解决方案

不写文件，直接将 PNG 数据进行 Base64 编码，构造 data:URI 传给 QML：

```cpp
QString b64 = jsonObj["data"].toString();
m_mapImageUrl = "data:image/png;base64," + b64;
```

```qml
Image { source: robotAPI.mapImageUrl }  // 直接渲染
```

优势：无需文件 I/O、无需存储权限、加载更快。

## 进度

- [x] 问题定位 (查阅 Qt Android 文档)
- [x] Base64 data:URI 方案实现
- [x] 云台APP + 导航APP 双端验证
- [x] `API_DOC.md` 补充图片传输说明
