// 批量完善IELTS词汇数据库中所有单词的空字段，不覆盖已有内容
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 可自定义完善内容的规则
function getDemoData(word) {
  // 这里只做演示，实际可接入API或本地词典
  return {
    phonetic: `[${word[0] || 'ə'}-demo]`,
    roots: word.length > 5 ? '词根演示' : '',
    affixes: word.length > 7 ? '词缀演示' : '',
    etymology: `"${word}" 的词源演示`,
    definitionEn: `Definition for "${word}" (demo)`,
    definitionZh: `"${word}" 的中文释义（演示）`,
    example: `This is a demo example for "${word}".`
  };
}

async function batchUpdateWords() {
  try {
    const words = await prisma.word.findMany();
    let updatedCount = 0;
    for (const w of words) {
      // 只完善空字段或待完善内容
      const needsUpdate =
        !w.phonetic ||
        w.phonetic.trim() === '' ||
        !w.definitionEn ||
        w.definitionEn.includes('to be updated by crawler') ||
        !w.definitionZh ||
        w.definitionZh.includes('待爬虫更新');
      if (!needsUpdate) continue;
      const demo = getDemoData(w.word);
      await prisma.word.update({
        where: { sequenceNumber: w.sequenceNumber },
        data: {
          phonetic: w.phonetic && w.phonetic.trim() !== '' ? w.phonetic : demo.phonetic,
          roots: w.roots && w.roots.trim() !== '' ? w.roots : demo.roots,
          affixes: w.affixes && w.affixes.trim() !== '' ? w.affixes : demo.affixes,
          etymology: w.etymology && w.etymology.trim() !== '' ? w.etymology : demo.etymology,
          definitionEn: w.definitionEn && !w.definitionEn.includes('to be updated by crawler') ? w.definitionEn : demo.definitionEn,
          definitionZh: w.definitionZh && !w.definitionZh.includes('待爬虫更新') ? w.definitionZh : demo.definitionZh,
          example: w.example && w.example.trim() !== '' ? w.example : demo.example
        }
      });
      updatedCount++;
    }
    console.log(`已完善 ${updatedCount} 个单词。`);
  } catch (error) {
    console.error('批量完善失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

batchUpdateWords();
