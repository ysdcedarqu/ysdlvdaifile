---
layout: default
title: 履带式巡检车项目 - 首页
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
        <span class="title-line1">履带式巡检车</span>
        <span class="title-line2">Crawler Inspection Vehicle</span>
      </h1>
      <p class="hero-desc">
        基于履带式移动平台，搭载多传感器融合系统，实现复杂地形下的自主巡检与实时数据回传，
        为工业场景提供智能化、无人化的巡检解决方案。
      </p>
      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-value" data-count="{{stats.overallProgress}}">0</span>
          <span class="stat-unit">%</span>
          <span class="stat-label">总体进度</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" data-count="{{stats.activeIssues}}">0</span>
          <span class="stat-label">进行中任务</span>
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

<!-- 进度总览 -->
<section id="progress" class="section">
  <h2 class="section-title">
    <span class="title-icon">&#9776;</span>
    进度总览
    <span class="title-line"></span>
  </h2>
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
    <div class="progress-bars">
      {{processBars}}
    </div>
  </div>
</section>

<!-- 最新周报 -->
<section id="weekly" class="section">
  <h2 class="section-title">
    <span class="title-icon">&#9998;</span>
    最新周报
    <span class="title-line"></span>
  </h2>
  <div class="weekly-grid">
    {{weeklyCards}}
  </div>
  <div class="section-more">
    <a href="{{baseurl}}/weekly/" class="btn-more">查看全部周报 →</a>
  </div>
</section>

<!-- 里程碑时间线 -->
<section id="milestones" class="section">
  <h2 class="section-title">
    <span class="title-icon">&#9716;</span>
    项目里程碑
    <span class="title-line"></span>
  </h2>
  <div class="timeline">
    <div class="timeline-line"></div>
    {{timelineItems}}
  </div>
</section>

<!-- 技术架构 -->
<section id="tech" class="section">
  <h2 class="section-title">
    <span class="title-icon">&#9881;</span>
    技术架构
    <span class="title-line"></span>
  </h2>
  <div class="tech-grid">
    <div class="tech-card">
      <div class="tech-icon">&#9881;</div>
      <h4>机械平台</h4>
      <ul>
        <li>橡胶履带底盘</li>
        <li>独立悬挂系统</li>
        <li>IP65 防护等级</li>
        <li>最大爬坡 30°</li>
      </ul>
    </div>
    <div class="tech-card">
      <div class="tech-icon">&#9889;</div>
      <h4>电控系统</h4>
      <ul>
        <li>STM32F4 主控</li>
        <li>无刷直流电机</li>
        <li>CAN 总线通信</li>
        <li>48V 锂电池组</li>
      </ul>
    </div>
    <div class="tech-card">
      <div class="tech-icon">&#9741;</div>
      <h4>感知系统</h4>
      <ul>
        <li>16线激光雷达</li>
        <li>RGB-D 深度相机</li>
        <li>9轴 IMU 惯导</li>
        <li>红外热成像</li>
      </ul>
    </div>
    <div class="tech-card">
      <div class="tech-icon">&#9729;</div>
      <h4>软件平台</h4>
      <ul>
        <li>ROS2 机器人框架</li>
        <li>Web 远程监控</li>
        <li>实时数据看板</li>
        <li>AI 缺陷检测</li>
      </ul>
    </div>
  </div>
</section>

<!-- 问题追踪 -->
<section id="issues" class="section">
  <h2 class="section-title">
    <span class="title-icon">&#9888;</span>
    问题追踪
    <span class="title-line"></span>
  </h2>
  <div class="issues-grid">
    {{issuesCards}}
  </div>
  <div class="section-more">
    <a href="{{baseurl}}/issues/" class="btn-more">查看全部问题 →</a>
  </div>
</section>
