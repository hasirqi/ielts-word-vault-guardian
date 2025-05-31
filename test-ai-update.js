// 简化测试 - 查看数据库状态
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickTest() {
  try {
    const totalWords = await prisma.word.count();
    console.log(`📊 总单词数: ${totalWords}`);
    
    // 获取样本
    const sample = await prisma.word.findMany({ take: 3 });
    console.log('\n📝 样本数据:');
    sample.forEach((w, i) => {
      console.log(`${i+1}. ${w.word}`);
      console.log(`   同义词: ${w.synonyms || '空'}`);
      console.log(`   词根: ${w.roots || '空'}`);
      console.log(`   词源: ${w.etymology || '空'}`);
    });
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
