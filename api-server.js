const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const path = require('path');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.API_PORT || 3001;

// 启用 CORS
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// API 路由
app.get('/api/words', async (req, res) => {
  try {
    console.log('API 请求开始 - 获取词汇数据');
    const startTime = Date.now();
    
    const words = await prisma.word.findMany({
      orderBy: [
        { lastReviewed: 'asc' },
        { word: 'asc' }
      ]
    });
    
    const endTime = Date.now();
    console.log(`从数据库获取到词汇数量: ${words.length}, 耗时: ${endTime - startTime}ms`);
    
    res.json(words); // 只返回数组
  } catch (error) {
    console.error('获取词汇数据失败:', error);
    res.status(500).json({ error: 'Failed to fetch words', message: error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 更新单词示例
app.post('/api/word/demo-update', async (req, res) => {
  try {
    const updated = await prisma.word.update({
      where: { sequenceNumber: 1 },
      data: {
        phonetic: '/əˈbændən/',
        roots: 'ab-（离开）+ andon（给予）',
        affixes: 'ab-（离开，分离）',
        etymology: '来自拉丁语 abandonare，ab-（离开）+ donare（给予）',
        definitionEn: 'To leave behind or give up completely; to desert.',
        definitionZh: '抛弃，遗弃；完全放弃。',
        example: 'He abandoned his car in the snow.（他把车遗弃在雪地里。）',
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 86400000),
        reviewCount: 1,
        known: true
      }
    });
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 数据库查看器: http://localhost:${PORT}/db-viewer.html`);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('正在关闭服务器...');
  await prisma.$disconnect();
  process.exit(0);
});
