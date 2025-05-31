const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDataStatus() {
  try {
    const words = await prisma.word.findMany({ 
      take: 5,
      orderBy: { sequenceNumber: 'asc' }
    });
    
    console.log('数据检查样本:');
    words.forEach((w, i) => {
      console.log(`\n单词 ${i+1}: ${w.word}`);
      console.log(`  音标: '${w.phonetic || 'NULL'}'`);
      console.log(`  词性: '${w.partOfSpeech || 'NULL'}'`);
      console.log(`  同义词: '${w.synonyms || 'NULL'}'`);
      console.log(`  反义词: '${w.antonyms || 'NULL'}'`);
      console.log(`  词根: '${w.roots || 'NULL'}'`);
      console.log(`  词缀: '${w.affixes || 'NULL'}'`);
      console.log(`  词源: '${w.etymology || 'NULL'}'`);
      console.log(`  记忆提示: '${w.memoryTip || 'NULL'}'`);
    });
    
    // 统计缺失数据
    const total = await prisma.word.count();
    const emptyPhonetic = await prisma.word.count({ where: { OR: [{ phonetic: null }, { phonetic: '' }] } });
    const emptyPartOfSpeech = await prisma.word.count({ where: { OR: [{ partOfSpeech: null }, { partOfSpeech: '' }] } });
    const emptySynonyms = await prisma.word.count({ where: { OR: [{ synonyms: null }, { synonyms: '' }] } });
    const emptyEtymology = await prisma.word.count({ where: { OR: [{ etymology: null }, { etymology: '' }] } });
    
    console.log(`\n数据统计 (总计 ${total} 个单词):`);
    console.log(`  缺少音标: ${emptyPhonetic}`);
    console.log(`  缺少词性: ${emptyPartOfSpeech}`);
    console.log(`  缺少同义词: ${emptySynonyms}`);
    console.log(`  缺少词源: ${emptyEtymology}`);
    
  } catch (error) {
    console.error('检查失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDataStatus();
