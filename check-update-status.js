const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStatus() {
  try {
    const total = await prisma.word.count();
    const withPhonetic = await prisma.word.count({ 
      where: { 
        phonetic: { 
          not: '' 
        } 
      } 
    });
    const withPartOfSpeech = await prisma.word.count({ 
      where: { 
        partOfSpeech: { 
          not: null,
          not: ''
        } 
      } 
    });
    const withSynonyms = await prisma.word.count({ 
      where: { 
        synonyms: { 
          not: null,
          not: ''
        } 
      } 
    });
    
    console.log(`总词汇数: ${total}`);
    console.log(`有音标的: ${withPhonetic}`);
    console.log(`有词性的: ${withPartOfSpeech}`);
    console.log(`有同义词的: ${withSynonyms}`);
    console.log(`更新进度: ${Math.round((withPhonetic/total)*100)}%`);
  } catch (error) {
    console.error('检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus();
