import { PrismaClient } from '@prisma/client';
import { wordCategories } from '../src/data/extendedIeltsWordList';

const prisma = new PrismaClient();

async function main() {
  try {
    // 先清空表
    console.log('正在清空数据库...');
    await prisma.word.deleteMany();

    // 合并所有类别的词汇
    const allWords = [
      ...wordCategories.academic,
      ...wordCategories.general,
      ...wordCategories.science,
      ...wordCategories.business,
      ...wordCategories.technology,
      ...wordCategories.environment
    ];

    console.log(`总词汇量: ${allWords.length}`);

    // 分批导入，每批1000个词
    const batchSize = 1000;
    for (let i = 0; i < allWords.length; i += batchSize) {
      const batch = allWords.slice(i, i + batchSize).map(w => ({
        id: w.id,
        word: w.word,
        phonetic: w.phonetic || '',
        roots: w.etymology?.roots || null,
        affixes: w.etymology?.affixes || null,
        etymology: w.etymology?.explanation || null,
        definitionEn: w.definitions.en,
        definitionZh: w.definitions.zh,
        example: w.example || '',
        lastReviewed: w.lastReviewed ? new Date(w.lastReviewed) : null,
        nextReview: w.nextReview ? new Date(w.nextReview) : null,
        reviewCount: w.reviewCount || 0,        known: w.known || false
      }));      await prisma.word.createMany({
        data: batch
      });

      console.log(`已导入 ${Math.min((i + batchSize), allWords.length)} / ${allWords.length} 个词`);
    }

    console.log('词库导入完成！');
  } catch (error) {
    console.error('导入过程中出错:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
