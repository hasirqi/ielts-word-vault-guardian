const { PrismaClient } = require('@prisma/client');

async function quickStatus() {
  const prisma = new PrismaClient();
  
  try {
    const count = await prisma.word.count();
    console.log(`📚 数据库状态: ${count} 个单词`);
    
    const sample = await prisma.word.findFirst({
      select: {
        word: true,
        definitionEn: true,
        phonetic: true
      }
    });
    
    if (sample) {
      console.log(`🔤 示例单词: ${sample.word} ${sample.phonetic || ''}`);
      console.log(`📖 释义: ${sample.definitionEn.substring(0, 80)}...`);
    }
    
    console.log(`🌐 前端服务: http://localhost:5173/`);
    console.log(`📊 数据库查看器: http://localhost:5173/db-viewer.html`);
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickStatus();
