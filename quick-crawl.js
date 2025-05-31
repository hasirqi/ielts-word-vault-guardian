const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

// 防止被封禁，添加随机延迟
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomSleep = () => sleep(Math.random() * 1000 + 500);

// 从 Free Dictionary API 获取单词详细信息
async function fetchWordDetails(word) {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const response = await axios.get(url);
    const data = response.data[0];

    // 提取音标
    let phonetic = data.phonetic || '';
    if (!phonetic && data.phonetics && data.phonetics.length > 0) {
      const phoneticData = data.phonetics.find(p => p.text) || data.phonetics[0];
      phonetic = phoneticData?.text || '';
    }

    // 提取英文释义和例句
    let definitionEn = '';
    let example = '';

    if (data.meanings && data.meanings.length > 0) {
      const meaning = data.meanings[0];
      if (meaning.definitions && meaning.definitions.length > 0) {
        const def = meaning.definitions[0];
        definitionEn = def.definition || '';
        example = def.example || '';

        // 如果第一个定义没有例句，尝试从其他定义中找
        if (!example) {
          for (let i = 1; i < meaning.definitions.length; i++) {
            if (meaning.definitions[i].example) {
              example = meaning.definitions[i].example;
              break;
            }
          }
        }
      }
    }

    // 生成中文释义（简单处理）
    const definitionZh = `${word} 的中文释义 - 待翻译`;

    return {
      phonetic: phonetic.replace(/[\/\\]/g, ''),
      definitionEn,
      definitionZh,
      example,
      success: true
    };
  } catch (error) {
    console.log(`获取 ${word} 失败:`, error.message);
    return { success: false };
  }
}

// 保存进度到文件
function saveProgress(progress) {
  fs.writeFileSync('crawl_progress.json', JSON.stringify(progress, null, 2));
}

// 加载进度
function loadProgress() {
  try {
    if (fs.existsSync('crawl_progress.json')) {
      return JSON.parse(fs.readFileSync('crawl_progress.json', 'utf-8'));
    }
  } catch (error) {
    console.log('加载进度失败，从头开始');
  }
  return { currentIndex: 0, totalProcessed: 0, errors: [] };
}

async function crawlWords() {
  try {
    console.log('开始爬取单词详细信息...');
    
    // 获取需要更新的单词
    const words = await prisma.word.findMany({
      where: {
        definitionEn: {
          contains: 'to be updated by crawler'
        }
      },
      select: {
        sequenceNumber: true,
        word: true
      },
      orderBy: {
        sequenceNumber: 'asc'
      }
    });

    console.log(`找到 ${words.length} 个需要更新的单词`);

    const progress = loadProgress();
    let startIndex = progress.currentIndex || 0;
    
    console.log(`从第 ${startIndex + 1} 个单词开始处理...`);

    for (let i = startIndex; i < words.length; i++) {
      const wordData = words[i];
      console.log(`正在处理 ${i + 1}/${words.length}: ${wordData.word}`);

      const details = await fetchWordDetails(wordData.word);
      
      if (details.success) {
        try {
          await prisma.word.update({
            where: { sequenceNumber: wordData.sequenceNumber },
            data: {
              phonetic: details.phonetic,
              definitionEn: details.definitionEn,
              definitionZh: details.definitionZh,
              example: details.example
            }
          });
          console.log(`✅ 更新成功: ${wordData.word}`);
        } catch (dbError) {
          console.log(`❌ 数据库更新失败: ${wordData.word}`, dbError.message);
          progress.errors.push({ word: wordData.word, error: dbError.message });
        }
      } else {
        progress.errors.push({ word: wordData.word, error: 'API 获取失败' });
      }

      progress.currentIndex = i + 1;
      progress.totalProcessed = i + 1;
      
      // 每10个单词保存一次进度
      if ((i + 1) % 10 === 0) {
        saveProgress(progress);
        console.log(`已处理 ${i + 1} 个单词，已保存进度`);
      }

      // 随机延迟防止被封
      await randomSleep();
    }

    saveProgress(progress);
    console.log('\\n爬取完成！');
    console.log(`总计处理: ${progress.totalProcessed} 个单词`);
    console.log(`错误数量: ${progress.errors.length} 个`);

  } catch (error) {
    console.error('爬取过程中发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crawlWords();
