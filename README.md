# 履带式巡检车 - 项目进度汇报平台

基于 Markdown + YAML Front Matter 驱动的静态站点生成器，用于展示履带式巡检车项目的开发进度、周报记录、问题追踪。

## 🌐 在线访问

| 平台 | 地址 |
|------|------|
| **GitHub Pages** | [ysdcedarqu.github.io/ysdlvdaifile](https://ysdcedarqu.github.io/ysdlvdaifile/) |
| **Gitee Pages** | [ysdcedarqu.gitee.io/ysdlvdaifile](https://ysdcedarqu.gitee.io/ysdlvdaifile/) |
| **腾讯云 CloudBase** | [ysdcedarqu-d8geyz1cp142eca8b.tcloudbaseapp.com/demo1/](https://ysdcedarqu-d8geyz1cp142eca8b.tcloudbaseapp.com/demo1/) |

## 📦 代码仓库

| 平台 | 地址 |
|------|------|
| **GitHub** | [github.com/ysdcedarqu/ysdlvdaifile](https://github.com/ysdcedarqu/ysdlvdaifile) |
| **Gitee** | [gitee.com/ysdcedarqu/ysdlvdaifile](https://gitee.com/ysdcedarqu/ysdlvdaifile) |

## 🚀 快速开始

```bash
npm install        # 安装依赖
npm run build      # 构建站点 → _site/
npm start          # 本地预览 → http://localhost:3000
```

## ✏️ 写周报

在 `content/weekly/` 下新建 Markdown 文件：

```markdown
---
title: "第N周 · 标题"
date: 2026-06-01
progress: 60
status: active
summary: 一句话总结
---

## 本周进展
- ✅ 完成...
- 🔄 进行中...

## 下周计划
- ...
```

然后运行 `npm run build`，新周报自动出现在网站上。

## 🏗️ 技术栈

- **构建**: gray-matter + marked + sass (Dart Sass)
- **运行时**: Node.js + Express（本地预览）
- **部署**: GitHub Actions + GitHub Pages / Gitee Pages / 腾讯云 CloudBase
- **样式**: 科技感深色主题、Canvas 粒子背景、响应式设计

## 📁 项目结构

```
├── build.js              # SSG 构建脚本
├── server.js             # 本地预览服务器
├── content/              # Markdown 内容源
│   ├── index.md          # 首页模板
│   ├── weekly/           # 周报
│   ├── issues/           # 问题追踪
│   └── process/          # 里程碑阶段
├── _layouts/             # HTML 布局模板
├── _sass/main.scss       # 样式源文件
├── _site/                # 构建产物（GitHub Pages）
├── dist/                 # 构建产物（CloudBase）
├── public/               # 静态资源（兼容旧版）
└── .github/workflows/    # CI/CD 自动部署
```
