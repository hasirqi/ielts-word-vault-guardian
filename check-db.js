const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('正在检查数据库状态...\n');
    
    // 获取总词汇数量
    const totalWords = await prisma.word.count();
    console.log(`📚 数据库中总计有 ${totalWords} 个单词`);
    
    // 获取有释义的词汇数量
    const wordsWithDefinition = await prisma.word.count({
      where: {
        definitionEn: {
          not: {
            contains: 'to be updated by crawler'
          }
        }
      }
    });
    console.log(`✅ 已有完整释义的单词: ${wordsWithDefinition}`);
    
    // 获取有词源信息的词汇数量
    const wordsWithEtymology = await prisma.word.count({
      where: {
        etymology: {
          not: ''
        }
      }
    });
    console.log(`🌱 已有词源信息的单词: ${wordsWithEtymology}`);
    
    // 获取已复习的词汇数量
    const reviewedWords = await prisma.word.count({
      where: {
        reviewCount: {
          gt: 0
        }
      }
    });
    console.log(`📖 已复习过的单词: ${reviewedWords}`);
    
    // 获取已掌握的词汇数量
    const knownWords = await prisma.word.count({
      where: {
        known: true
      }
    });
    console.log(`🎯 已掌握的单词: ${knownWords}`);
    
    // 显示一些示例单词
    console.log('\n📝 最近添加的单词示例:');
    const recentWords = await prisma.word.findMany({
      take: 5,
      orderBy: {
        sequenceNumber: 'desc'
      },
      select: {
        word: true,
        definitionEn: true,
        etymology: true
      }
    });
    
    recentWords.forEach((word, index) => {
      console.log(`${index + 1}. ${word.word}`);
      if (word.etymology) {
        console.log(`   词源: ${word.etymology}`);
      }
      console.log(`   释义: ${word.definitionEn.substring(0, 80)}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('检查数据库时发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();