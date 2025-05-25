const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('正在连接数据库...');
    
    // 检查词汇总数
    const totalWords = await prisma.word.count();
    console.log(`数据库中总词汇数: ${totalWords}`);
      // 获取前10个词汇作为样本
    const sampleWords = await prisma.word.findMany({
      take: 10,
      select: {
        id: true,
        word: true,
        definitionEn: true,
        definitionZh: true,
        phonetic: true,
        etymology: true
      }
    });
      console.log('\n前10个词汇样本:');
    sampleWords.forEach((word, index) => {
      console.log(`${index + 1}. ${word.word} [${word.phonetic || ''}] - EN: ${(word.definitionEn || '').substring(0, 50)}... ZH: ${(word.definitionZh || '').substring(0, 30)}...`);
    });
    
    // 检查最近添加的词汇
    const recentWords = await prisma.word.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        word: true,
        definition: true,
        createdAt: true
      }
    });
    
    console.log('\n最近添加的5个词汇:');
    recentWords.forEach((word, index) => {
      console.log(`${index + 1}. ${word.word} - 添加时间: ${word.createdAt}`);
    });
    
  } catch (error) {
    console.error('数据库查询错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
