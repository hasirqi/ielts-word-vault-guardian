const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importWordsSimple() {
  try {
    console.log('开始导入单词...');
    
    // 读取单词列表
    const wordListPath = path.join(__dirname, 'scripts', 'ielts_core_words.txt');
    const words = fs.readFileSync(wordListPath, 'utf-8')
      .split('\n')
      .map(word => word.trim())
      .filter(word => word);

    console.log(`总共找到 ${words.length} 个单词`);
    
    // 检查数据库中已有的单词
    const existingWords = await prisma.word.findMany({
      select: { word: true }
    });
    const existingWordSet = new Set(existingWords.map(w => w.word));
    
    console.log(`数据库中已有 ${existingWords.length} 个单词`);
    
    // 过滤出需要添加的新单词
    const newWords = words.filter(word => !existingWordSet.has(word));
    console.log(`需要添加 ${newWords.length} 个新单词`);
    
    if (newWords.length === 0) {
      console.log('所有单词都已存在于数据库中！');
      return;
    }
    
    // 批量导入新单词
    let processed = 0;
    const batchSize = 100;
    
    for (let i = 0; i < newWords.length; i += batchSize) {
      const batch = newWords.slice(i, i + batchSize);      const wordData = batch.map((word, index) => ({
        id: `ielts-${Date.now()}-${processed + index + 1}`,
        word: word,
        phonetic: '',
        roots: '',
        affixes: '',
        etymology: '',
        definitionEn: `Definition for "${word}" - to be updated by crawler`,
        definitionZh: `"${word}" 的中文释义 - 待爬虫更新`,
        example: '',
        lastReviewed: null,
        nextReview: null,
        reviewCount: 0,
        known: false
      }));
        await prisma.word.createMany({
        data: wordData
      });
      
      processed += batch.length;
      console.log(`已处理 ${processed}/${newWords.length} 个单词`);
    }
    
    console.log('单词导入完成！');
    
    // 最终统计
    const finalCount = await prisma.word.count();
    console.log(`数据库中现有 ${finalCount} 个单词`);
    
  } catch (error) {
    console.error('导入过程中发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importWordsSimple();
