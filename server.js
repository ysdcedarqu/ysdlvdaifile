const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 优先使用构建产物 _site/，其次 public/（向后兼容）
const siteDir = path.join(__dirname, '_site');
const publicDir = path.join(__dirname, 'public');

if (fs.existsSync(siteDir)) {
    app.use(express.static(siteDir));
} else {
    app.use(express.static(publicDir));
}

app.listen(PORT, () => {
    const serving = fs.existsSync(siteDir) ? '_site/' : 'public/';
    console.log(`
╔══════════════════════════════════════════╗
║  履带式巡检车 - 项目进度看板             ║
║  Serving: ${serving.padEnd(32)} ║
║  URL:    http://localhost:${PORT}               ║
╚══════════════════════════════════════════╝
    `);
});
