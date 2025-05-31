const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCrawl() {
  try {
    console.log('测试爬虫功能...');
    
    // 获取一个需要更新的单词进行测试
    const word = await prisma.word.findFirst({
      where: {
        definitionEn: {
          contains: 'to be updated by crawler'
        }
      }
    });

    if (!word) {
      console.log('没有找到需要更新的单词');
      return;
    }

    console.log(`测试单词: ${word.word}`);

    // 测试 API 调用
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.word)}`;
    console.log(`请求 URL: ${url}`);
    
    const response = await axios.get(url);
    console.log('API 响应成功！');
    
    const data = response.data[0];
    console.log('单词数据:', JSON.stringify(data, null, 2).substring(0, 500) + '...');

  } catch (error) {
    console.error('测试失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCrawl();
