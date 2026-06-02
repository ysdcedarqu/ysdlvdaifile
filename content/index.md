---
layout: default
title: AGV 导航与机器人控制系统 - 首页
---

<!-- Hero 区域 -->
<section class="section hero-section">
  <div class="hero-grid">
    <div class="hero-text">
      <div class="hero-badge">
        <span class="badge-pulse"></span>
        PROJECT IN PROGRESS
      </div>
      <h1 class="hero-title">
        <span class="title-line1">AGV 导航与机器人控制系统</span>
        <span class="title-line2">AGV Navigation & Robot Control System</span>
      </h1>
      <p class="hero-desc">
        基于 Qt 6.8 + Android + FastAPI 的机器人统一操控平台，
        涵盖树莓派后端控制（GPIO/云台/音频/海康摄像头）、
        Android 导航 APP（任务链/MJPEG/地图编辑）、云端巡检解析。
      </p>
      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-value" data-count="{{stats.overallProgress}}">0</span>
          <span class="stat-unit">%</span>
          <span class="stat-label">总体进度</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" data-count="{{stats.activeIssues}}">0</span>
          <span class="stat-label">已解决问题</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" data-count="{{stats.completedPhases}}">0</span>
          <span class="stat-label">已完成阶段</span>
        </div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="vehicle-hologram">
        <div class="holo-ring ring1"></div>
        <div class="holo-ring ring2"></div>
        <div class="holo-ring ring3"></div>
        <div class="holo-vehicle">
          <svg viewBox="0 0 200 140" class="vehicle-svg">
            <rect x="30" y="40" width="140" height="60" rx="8" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0.8"/>
            <rect x="50" y="20" width="80" height="25" rx="4" fill="none" stroke="var(--accent)" stroke-width="1.5" opacity="0.6"/>
            <circle cx="55" cy="105" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/>
            <circle cx="95" cy="105" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/>
            <circle cx="135" cy="105" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/>
            <line x1="35" y1="95" x2="165" y2="95" stroke="var(--accent)" stroke-width="1.5" opacity="0.5"/>
            <line x1="35" y1="115" x2="165" y2="115" stroke="var(--accent)" stroke-width="1.5" opacity="0.5"/>
            <rect x="85" y="10" width="10" height="12" rx="2" fill="var(--accent)" opacity="0.5"/>
            <circle cx="90" cy="8" r="4" fill="var(--accent)" opacity="0.8"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 关联仓库 -->
<section class="section">
  <h2 class="section-title"><span class="title-icon">&#128451;</span>关联仓库<span class="title-line"></span></h2>
  <div class="tech-grid" style="grid-template-columns: repeat(4, 1fr);">
    <a href="https://gitee.com/tydfgt/anzhuo" target="_blank" class="tech-card" style="text-decoration:none;">
      <div class="tech-icon">&#128241;</div>
      <h4>anzhuo</h4>
      <p style="color:var(--text-secondary);font-size:0.85rem;">安卓客户端<br/>AGV导航 + 云台APP</p>
    </a>
    <a href="https://gitee.com/tydfgt/windowsxunjianat" target="_blank" class="tech-card" style="text-decoration:none;">
      <div class="tech-icon">&#128187;</div>
      <h4>windowsxunjianat</h4>
      <p style="color:var(--text-secondary);font-size:0.85rem;">Windows桌面版<br/>AGV导航巡检</p>
    </a>
    <a href="https://gitee.com/tydfgt/robothouduan" target="_blank" class="tech-card" style="text-decoration:none;">
      <div class="tech-icon">&#9881;</div>
      <h4>robothouduan</h4>
      <p style="color:var(--text-secondary);font-size:0.85rem;">树莓派后端<br/>FastAPI + 海康SDK</p>
    </a>
    <a href="https://gitee.com/tydfgt/ysdlvdaifile" target="_blank" class="tech-card" style="text-decoration:none;">
      <div class="tech-icon">&#127760;</div>
      <h4>ysdlvdaifile</h4>
      <p style="color:var(--text-secondary);font-size:0.85rem;">进度看板<br/>本页面</p>
    </a>
  </div>
</section>

<!-- 技术架构 -->
<section id="tech" class="section">
  <h2 class="section-title"><span class="title-icon">&#9881;</span>技术架构<span class="title-line"></span></h2>

  <div class="arch-flow">
    <!-- 客户端层 -->
    <div class="arch-layer">
      <div class="arch-label">客户端</div>
      <div class="arch-items">
        <div class="arch-item android">
          <span class="arch-icon">&#128241;</span>
          <strong>Android 平板</strong>
          <p>Qt 6.8 + QML<br/>AGVNav APK<br/>arm64-v8a</p>
        </div>
        <div class="arch-item windows">
          <span class="arch-icon">&#128187;</span>
          <strong>Windows PC</strong>
          <p>Qt 6.8 Desktop<br/>AGVNav.exe<br/>键鼠交互</p>
        </div>
      </div>
    </div>

    <div class="arch-arrow">▼ HTTP / WebSocket ▼</div>

    <!-- 后端层 -->
    <div class="arch-layer">
      <div class="arch-label">后端 · 树莓派</div>
      <div class="arch-items">
        <div class="arch-item backend">
          <span class="arch-icon">&#9881;</span>
          <strong>FastAPI :5003</strong>
          <p>Python 3<br/>uvicorn<br/>统一控制中心 v3.0</p>
        </div>
        <div class="arch-item backend">
          <span class="arch-icon">&#128225;</span>
          <strong>C++ PTZ Server</strong>
          <p>TCP :9988<br/>海康 SDK<br/>MJPEG :9990</p>
        </div>
      </div>
    </div>

    <div class="arch-arrow">▼ GPIO / RS-485 / TCP ▼</div>

    <!-- 硬件层 -->
    <div class="arch-layer">
      <div class="arch-label">硬件</div>
      <div class="arch-items">
        <div class="arch-item hardware">
          <span class="arch-icon">&#9889;</span>
          <strong>GPIO</strong>
          <p>引脚 22/27<br/>BCM 编号</p>
        </div>
        <div class="arch-item hardware">
          <span class="arch-icon">&#128247;</span>
          <strong>海康摄像头</strong>
          <p>PTZ 云台<br/>SDK 控制</p>
        </div>
        <div class="arch-item hardware">
          <span class="arch-icon">&#128266;</span>
          <strong>USB 声卡</strong>
          <p>PCM 音频<br/>ALSA 播放</p>
        </div>
        <div class="arch-item hardware">
          <span class="arch-icon">&#9881;</span>
          <strong>PELCO-D 云台</strong>
          <p>RS-485<br/>/dev/ttySC0</p>
        </div>
      </div>
    </div>

    <div class="arch-arrow">▼ HTTP Trigger ▼</div>

    <!-- 云端层 -->
    <div class="arch-layer">
      <div class="arch-label">云端</div>
      <div class="arch-items single">
        <div class="arch-item cloud">
          <span class="arch-icon">&#9729;</span>
          <strong>巡检服务器</strong>
          <p>8.148.200.227 :9998<br/>图片解析 API<br/>巡检记录存储</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 进度总览 -->
<section id="progress" class="section">
  <h2 class="section-title"><span class="title-icon">&#9776;</span>进度总览<span class="title-line"></span></h2>
  <div class="progress-grid">
    <div class="progress-ring-container">
      <svg class="progress-ring" viewBox="0 0 200 200">
        <circle class="ring-bg" cx="100" cy="100" r="85"/>
        <circle class="ring-progress" cx="100" cy="100" r="85" stroke-dasharray="534" stroke-dashoffset="{{stats.ringOffset}}"/>
      </svg>
      <div class="progress-ring-text">
        <span class="ring-percent">{{stats.overallProgress}}%</span>
        <span class="ring-label">整体进度</span>
      </div>
    </div>
    <div class="progress-bars">{{processBars}}</div>
  </div>
</section>

<!-- 最新周报 -->
<section id="weekly" class="section">
  <h2 class="section-title"><span class="title-icon">&#9998;</span>最新周报<span class="title-line"></span></h2>
  <div class="weekly-grid">{{weeklyCards}}</div>
  <div class="section-more"><a href="{{baseurl}}/weekly/" class="btn-more">查看全部周报 →</a></div>
</section>

<!-- 里程碑 -->
<section id="milestones" class="section">
  <h2 class="section-title"><span class="title-icon">&#9716;</span>项目里程碑<span class="title-line"></span></h2>
  <div class="timeline"><div class="timeline-line"></div>{{timelineItems}}</div>
</section>

<!-- 问题追踪 -->
<section id="issues" class="section">
  <h2 class="section-title"><span class="title-icon">&#9888;</span>问题追踪<span class="title-line"></span></h2>
  <div class="issues-grid">{{issuesCards}}</div>
  <div class="section-more"><a href="{{baseurl}}/issues/" class="btn-more">查看全部问题 →</a></div>
</section>
