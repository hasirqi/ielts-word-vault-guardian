const { PrismaClient } = require('@prisma/client');

async function quickCheck() {
  const prisma = new PrismaClient();
  
  try {
    const count = await prisma.word.count();
    console.log(`数据库中有 ${count} 个单词`);
    
    const sample = await prisma.word.findMany({
      take: 3,
      select: {
        word: true,
        definitionEn: true,
        phonetic: true
      }
    });
    
    console.log('前3个单词:');
    sample.forEach((word, i) => {
      console.log(`${i+1}. ${word.word} ${word.phonetic || ''}`);
      console.log(`   ${word.definitionEn.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickCheck();
