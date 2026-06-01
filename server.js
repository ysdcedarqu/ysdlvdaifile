const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 所有路由返回 index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║  履带式巡检车 - 项目进度看板             ║
║  Server running on http://localhost:${PORT}  ║
╚══════════════════════════════════════════╝
    `);
});
