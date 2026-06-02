#!/usr/bin/env node
/**
 * YSDLAB 静态站点生成器
 * 基于 Markdown + YAML Front Matter 构建多页面项目进度看板
 *
 * 核心依赖: gray-matter (解析), marked (渲染), sass (样式)
 * 设计原则: 数据与渲染分离, 全量构建
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const sass = require('sass');

// ============ 配置 ============
const CONFIG = {
  baseurl: process.env.BASEURL || '',
  siteTitle: '履带式巡检车 · 项目进度看板',
  siteDesc: 'YSDLAB Crawler Inspection Vehicle Progress Report',
  contentDir: path.join(__dirname, 'content'),
  layoutsDir: path.join(__dirname, '_layouts'),
  sassDir: path.join(__dirname, '_sass'),
  outputDir: path.join(__dirname, '_site'),
};

// ============ Marked 配置 ============
marked.setOptions({ breaks: true, gfm: true });
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  const isExternal = /^https?:\/\//.test(href);
  const target = isExternal ? ' target="_blank" rel="noopener"' : '';
  return `<a href="${href}"${target}>${text}</a>`;
};
marked.use({ renderer });

// ============ 工具函数 ============
function readFile(p) { return fs.readFileSync(p, 'utf-8'); }
function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf-8');
}
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
function relativeUrl(p) {
  if (!p) return CONFIG.baseurl;
  return CONFIG.baseurl + (p.startsWith('/') ? p : '/' + p);
}

function parseDate(str) {
  if (!str) return new Date(0);
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date(0) : d;
}
function formatDate(date, fmt) {
  const d = parseDate(date);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (fmt === 'ymd') return `${y} 年 ${m} 月 ${day} 日`;
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function statusBadge(status) {
  const map = {
    'completed': 'done', '已完成': 'done',
    'active': 'active', '进行中': 'active',
    'pending': 'pending', '待开始': 'pending', '未开始': 'pending',
    'open': 'active', 'resolved': 'done', '已解决': 'done',
  };
  const cls = map[status] || 'pending';
  return `<span class="timeline-status ${cls}">${status}</span>`;
}

function severityClass(severity) {
  const map = { '高': 'high', '中': 'medium', '低': 'low', 'high': 'high', 'medium': 'medium', 'low': 'low' };
  return map[severity] || 'low';
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============ SEO Meta 生成 ============
function generateSEOMeta(page, data) {
  const title = page.title ? `${page.title} · ${CONFIG.siteTitle}` : CONFIG.siteTitle;
  const desc = page.summary || data.site?.description || CONFIG.siteDesc;
  return `
    <meta name="description" content="${escapeHtml(desc)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">`;
}

// ============ 数据收集层 ============
function collectData() {
  const data = {
    posts: [],
    issues: [],
    processPages: [],
    stats: {},
    site: {
      title: CONFIG.siteTitle,
      description: CONFIG.siteDesc,
    },
  };

  // 收集周报
  const weeklyDir = path.join(CONFIG.contentDir, 'weekly');
  if (fs.existsSync(weeklyDir)) {
    fs.readdirSync(weeklyDir)
      .filter(f => f.endsWith('.md'))
      .filter(f => f !== 'TEMPLATE.md' && !f.startsWith('_'))
      .forEach(f => {
        const raw = readFile(path.join(weeklyDir, f));
        const { data: fm, content } = matter(raw, { language: 'yaml', delimiters: '---' });
        if (fm.published === false || fm.draft === true) return;
        data.posts.push({
          ...fm,
          content: marked.parse(content),
          rawContent: content,
          url: relativeUrl('/weekly/' + f.replace('.md', '.html')),
          filename: f,
        });
      });
  }

  // 排序: 最新在前
  data.posts.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // 收集问题
  const issuesDir = path.join(CONFIG.contentDir, 'issues');
  if (fs.existsSync(issuesDir)) {
    fs.readdirSync(issuesDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .forEach(f => {
        const raw = readFile(path.join(issuesDir, f));
        const { data: fm, content } = matter(raw, { language: 'yaml', delimiters: '---' });
        data.issues.push({
          ...fm,
          content: marked.parse(content),
          url: relativeUrl('/issues/' + f.replace('.md', '.html')),
          filename: f,
        });
      });
  }

  // 收集流程阶段
  const processDir = path.join(CONFIG.contentDir, 'process');
  if (fs.existsSync(processDir)) {
    fs.readdirSync(processDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .forEach(f => {
        const raw = readFile(path.join(processDir, f));
        const { data: fm, content } = matter(raw, { language: 'yaml', delimiters: '---' });
        data.processPages.push({
          ...fm,
          content: marked.parse(content),
          filename: f,
        });
      });
  }
  data.processPages.sort((a, b) => (a.phase || 99) - (b.phase || 99));

  // 计算统计数据
  const completedPhases = data.processPages.filter(p => p.status === 'completed').length;
  const activeIssues = data.issues.filter(i => i.status === 'open').length;
  const overallProgress = data.processPages.length > 0
    ? Math.round(data.processPages.reduce((sum, p) => sum + (p.progress || 0), 0) / data.processPages.length)
    : 0;

  data.stats = {
    overallProgress,
    activeIssues,
    completedPhases,
    totalIssues: data.issues.length,
    totalPhases: data.processPages.length,
    totalPosts: data.posts.length,
    ringOffset: Math.round(534 - (overallProgress / 100) * 534),
    latestPost: data.posts[0] || null,
    currentPhase: data.processPages.find(p => p.status === 'active') || null,
  };

  return data;
}

// ============ 模板渲染引擎 ============
function applyTemplate(html, vars) {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }
  return result;
}

function renderLayout(page, data, bodyContent, layoutName) {
  const layoutFile = path.join(CONFIG.layoutsDir, `${layoutName || 'default'}.html`);
  let html = readFile(layoutFile);

  html = applyTemplate(html, {
    pageTitle: page.title ? `${page.title} · ${CONFIG.siteTitle}` : CONFIG.siteTitle,
    content: bodyContent,
    baseurl: CONFIG.baseurl,
    seoMeta: generateSEOMeta(page, data),
  });

  return html;
}

// ============ 渲染函数 ============

// 首页
function renderIndex(data) {
  const { stats, posts, issues, processPages } = data;

  // 进度条
  const processBars = processPages.map(p => `
    <div class="progress-item">
      <div class="progress-header">
        <span class="progress-name">${p.title}</span>
        <span class="progress-percent">${p.progress || 0}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${p.progress || 0}%"></div>
      </div>
    </div>`).join('');

  // 最新周报卡片
  const weeklyCards = posts.slice(0, 4).map(p => `
    <a href="${p.url}" class="weekly-card">
      <span class="weekly-card-date">${formatDate(p.date, 'ymd')}</span>
      <h3>${p.title}</h3>
      <p>${p.summary || ''}</p>
      ${p.progress !== undefined ? `
      <div class="progress-mini">
        <span class="progress-mini-label">${p.progress}%</span>
        <div class="progress-mini-track">
          <div class="progress-mini-fill" style="width:${p.progress}%"></div>
        </div>
      </div>` : ''}
    </a>`).join('');

  // 时间线
  let timelineSide = 'left';
  const timelineItems = processPages.map((p, i) => {
    timelineSide = (i % 2 === 0) ? 'left' : 'right';
    const dotClass = p.status === 'completed' ? 'done' : (p.status === 'active' ? 'pulse' : '');
    const statusText = p.status === 'completed' ? '已完成' : (p.status === 'active' ? '进行中' : '待开始');
    return `
    <div class="timeline-item ${timelineSide} ${p.status === 'completed' ? 'done' : ''}">
      <div class="timeline-dot ${dotClass}"></div>
      <div class="timeline-card">
        <span class="timeline-date">${p.date || ''}</span>
        <h4>${p.title}</h4>
        <p>${p.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
        ${statusBadge(statusText)}
      </div>
    </div>`;
  }).join('');

  // 问题卡片
  const issuesCards = issues.slice(0, 4).map(i => `
    <div class="issue-card">
      <div class="issue-header">
        <span class="issue-severity ${severityClass(i.severity)}">${i.severity || ''}</span>
        <span class="issue-status-badge ${i.status}">${i.status === 'open' ? '未解决' : '已解决'}</span>
      </div>
      <h4>${i.title}</h4>
      <p>${i.category || ''} · ${formatDate(i.date, 'ymd')}</p>
    </div>`).join('');

  // 读取 index.md 模板
  const indexMd = readFile(path.join(CONFIG.contentDir, 'index.md'));
  const { content: indexContent } = matter(indexMd, { language: 'yaml', delimiters: '---' });
  const bodyContent = applyTemplate(indexContent, {
    stats_overallProgress: stats.overallProgress,
    stats_activeIssues: stats.activeIssues,
    stats_completedPhases: stats.completedPhases,
    stats_ringOffset: stats.ringOffset,
    processBars,
    weeklyCards,
    timelineItems,
    issuesCards,
    baseurl: CONFIG.baseurl,
  });

  // 处理特殊的 {{stats.xxx}} 和 {{baseurl}} 模板变量
  let finalContent = bodyContent
    .replace(/\{\{stats\.overallProgress\}\}/g, stats.overallProgress)
    .replace(/\{\{stats\.activeIssues\}\}/g, stats.activeIssues)
    .replace(/\{\{stats\.completedPhases\}\}/g, stats.completedPhases)
    .replace(/\{\{stats\.ringOffset\}\}/g, stats.ringOffset)
    .replace(/\{\{baseurl\}\}/g, CONFIG.baseurl);

  return renderLayout({ title: '项目进度总览' }, data, finalContent, 'default');
}

// 周报详情页
function renderPost(post, data) {
  const bodyContent = `
    <article class="section post-detail">
      <a href="${relativeUrl('/weekly/')}" class="post-back">← 返回周报列表</a>
      <header class="post-header">
        <span class="post-date">${formatDate(post.date, 'ymd')}</span>
        <h1>${post.title}</h1>
        <div class="post-org">
          <span class="org-name">粤水电智能制造研究院</span>
          <span class="org-divider">|</span>
          <span class="org-dev">研发人员：屈雪松</span>
        </div>
        <div class="post-meta">
          <span>进度: ${post.progress || 0}%</span>
          <span>状态: ${statusBadge(post.status || '')}</span>
        </div>
      </header>
      <div class="post-content">
        ${post.content}
      </div>
    </article>`;

  return renderLayout({ title: post.title }, data, bodyContent, 'post');
}

// 问题详情页
function renderIssue(issue, data) {
  const bodyContent = `
    <article class="section post-detail">
      <a href="${relativeUrl('/issues/')}" class="post-back">← 返回问题列表</a>
      <header class="post-header">
        <span class="post-date">${formatDate(issue.date, 'ymd')}</span>
        <h1>${issue.title}</h1>
        <div class="post-meta">
          <span>严重程度: <span class="issue-severity ${severityClass(issue.severity)}">${issue.severity}</span></span>
          <span>分类: ${issue.category || ''}</span>
          <span>状态: <span class="issue-status-badge ${issue.status}">${issue.status === 'open' ? '未解决' : '已解决'}</span></span>
        </div>
      </header>
      <div class="post-content">
        ${issue.content}
      </div>
    </article>`;

  return renderLayout({ title: issue.title }, data, bodyContent, 'post');
}

// 周报列表页
function renderWeeklyList(data) {
  const listItems = data.posts.map(p => `
    <a href="${p.url}" class="weekly-list-item">
      <span class="weekly-list-date">${formatDate(p.date, 'ymd')}</span>
      <div class="weekly-list-content">
        <h3>${p.title}</h3>
        <p>${p.summary || ''} — 进度 ${p.progress || 0}%</p>
      </div>
    </a>`).join('');

  const bodyContent = `
    <section class="section">
      <h2 class="section-title">
        <span class="title-icon">&#9998;</span>
        全部周报
        <span class="title-line"></span>
      </h2>
      <p style="color:var(--text-muted);margin-bottom:2rem;">共 ${data.stats.totalPosts} 篇</p>
      <div class="weekly-list">
        ${listItems || '<p style="color:var(--text-muted);text-align:center;padding:3rem;">暂无周报</p>'}
      </div>
    </section>`;

  return renderLayout({ title: '全部周报' }, data, bodyContent, 'post');
}

// 问题列表页
function renderIssuesList(data) {
  const rows = data.issues.map(i => `
    <tr>
      <td><span class="issue-severity ${severityClass(i.severity)}">${i.severity}</span></td>
      <td><a href="${i.url}" style="color:var(--accent);text-decoration:none;">${i.title}</a></td>
      <td>${i.category || ''}</td>
      <td><span class="issue-status-badge ${i.status}">${i.status === 'open' ? '未解决' : '已解决'}</span></td>
      <td style="color:var(--text-muted);font-size:0.8rem;">${formatDate(i.date, 'ymd')}</td>
    </tr>`).join('');

  const openCount = data.issues.filter(i => i.status === 'open').length;
  const resolvedCount = data.issues.filter(i => i.status === 'resolved').length;

  const bodyContent = `
    <section class="section">
      <h2 class="section-title">
        <span class="title-icon">&#9888;</span>
        问题追踪
        <span class="title-line"></span>
      </h2>
      <p style="color:var(--text-muted);margin-bottom:1rem;">
        未解决: <span style="color:var(--warning);">${openCount}</span> &nbsp;|&nbsp;
        已解决: <span style="color:var(--success);">${resolvedCount}</span> &nbsp;|&nbsp;
        总计: ${data.stats.totalIssues}
      </p>
      <div class="issues-list">
        <table class="issues-table">
          <thead>
            <tr>
              <th>严重程度</th>
              <th>问题描述</th>
              <th>分类</th>
              <th>状态</th>
              <th>日期</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:3rem;">暂无问题记录</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>`;

  return renderLayout({ title: '问题追踪' }, data, bodyContent, 'post');
}

// ============ SCSS 编译 ============
function compileSCSS() {
  const scssFile = path.join(CONFIG.sassDir, 'main.scss');
  if (!fs.existsSync(scssFile)) {
    console.log('  ⚠ _sass/main.scss 不存在，跳过样式编译');
    return '';
  }
  const result = sass.compile(scssFile, {
    style: 'compressed',
    sourceMap: false,
    quietDeps: true,
  });
  return result.css;
}

// ============ 主构建流程 ============
function build() {
  console.log('\n🔧 YSDLAB SSG 开始构建...\n');

  // 0. 清理输出目录
  if (fs.existsSync(CONFIG.outputDir)) {
    fs.rmSync(CONFIG.outputDir, { recursive: true });
  }

  // 1. 收集数据
  console.log('📊 收集 Markdown 数据...');
  const data = collectData();
  console.log(`   ✓ 周报 ${data.stats.totalPosts} 篇`);
  console.log(`   ✓ 问题 ${data.stats.totalIssues} 个`);
  console.log(`   ✓ 阶段 ${data.stats.totalPhases} 个`);
  console.log(`   ✓ 总体进度: ${data.stats.overallProgress}%`);

  // 2. 构建页面
  console.log('\n📄 生成页面...');

  // 首页
  const indexHtml = renderIndex(data);
  writeFile(path.join(CONFIG.outputDir, 'index.html'), indexHtml);
  console.log('   ✓ index.html');

  // 周报详情页
  data.posts.forEach(post => {
    const html = renderPost(post, data);
    const outPath = path.join(CONFIG.outputDir, 'weekly', post.filename.replace('.md', '.html'));
    writeFile(outPath, html);
    console.log(`   ✓ ${post.filename.replace('.md', '.html')}`);
  });

  // 周报列表页
  const weeklyListHtml = renderWeeklyList(data);
  writeFile(path.join(CONFIG.outputDir, 'weekly', 'index.html'), weeklyListHtml);
  console.log('   ✓ weekly/index.html');

  // 问题详情页
  data.issues.forEach(issue => {
    const html = renderIssue(issue, data);
    const outPath = path.join(CONFIG.outputDir, 'issues', issue.filename.replace('.md', '.html'));
    writeFile(outPath, html);
    console.log(`   ✓ ${issue.filename.replace('.md', '.html')}`);
  });

  // 问题列表页
  const issuesListHtml = renderIssuesList(data);
  writeFile(path.join(CONFIG.outputDir, 'issues', 'index.html'), issuesListHtml);
  console.log('   ✓ issues/index.html');

  // 3. 编译 SCSS
  console.log('\n🎨 编译 SCSS...');
  const css = compileSCSS();
  writeFile(path.join(CONFIG.outputDir, 'assets', 'css', 'style.css'), css);
  console.log('   ✓ assets/css/style.css');

  // 4. 复制 JS
  console.log('\n📦 复制静态资源...');
  const jsSrc = path.join(__dirname, 'public', 'js', 'main.js');
  if (fs.existsSync(jsSrc)) {
    copyFile(jsSrc, path.join(CONFIG.outputDir, 'assets', 'js', 'main.js'));
    console.log('   ✓ assets/js/main.js');
  }

  // 5. 同时更新 dist 目录（兼容腾讯云 CloudBase 旧配置）
  console.log('\n🔄 同步到 dist/ ...');
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.cpSync(CONFIG.outputDir, distDir, { recursive: true });
  console.log('   ✓ dist/ 已同步');

  // 6. 统计
  const files = [];
  function countFiles(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
      if (d.isDirectory()) countFiles(path.join(dir, d.name));
      else files.push(path.join(dir, d.name));
    });
  }
  countFiles(CONFIG.outputDir);

  console.log(`\n✅ 构建完成！共生成 ${files.length} 个文件 → ${CONFIG.outputDir}/\n`);
}

// ============ 启动 ============
build();
