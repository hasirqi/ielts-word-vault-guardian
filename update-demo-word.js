const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mode = process.argv[2] || 'rollback';

async function updateDemoWord() {
  try {
    let updated;
    if (mode === 'update') {
      updated = await prisma.word.update({
        where: { sequenceNumber: 1 },
        data: {
          phonetic: "[ə'bændən]",
          roots: 'a(b)-（加强）+ bandon（命令、控制）',
          affixes: '',
          etymology: '源自古法语 abandoner，意为“放弃、抛弃”',
          definitionEn: 'to leave someone or something somewhere, sometimes not returning to get them',
          definitionZh: '抛弃，遗弃；放弃',
          example: 'The baby had been abandoned by its mother. / 他因恶劣天气被迫放弃了比赛。',
          lastReviewed: null,
          nextReview: null,
          reviewCount: 0,
          known: false
        }
      });
      console.log('已完善：', updated);
    } else {
      updated = await prisma.word.update({
        where: { sequenceNumber: 1 },
        data: {
          phonetic: '',
          roots: '',
          affixes: '',
          etymology: '',
          definitionEn: 'Definition for "abandon" - to be updated by crawler',
          definitionZh: '"abandon" 的中文释义 - 待爬虫更新',
          example: '',
          lastReviewed: null,
          nextReview: null,
          reviewCount: 0,
          known: false
        }
      });
      console.log('已回滚：', updated);
    }
  } catch (error) {
    console.error(mode === 'update' ? '完善失败:' : '回滚失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateDemoWord();
