import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// 防止API限流
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomSleep = () => sleep(Math.random() * 3000 + 2000);

// 从Free Dictionary API获取单词信息
async function fetchWordDetails(word: string): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    const data = response.data[0];
    
    // 提取音标
    let phonetic = data.phonetic || '';
    if (!phonetic && data.phonetics?.length > 0) {
      phonetic = data.phonetics.find((p: any) => p.text)?.text || '';
    }

    // 提取释义和例句
    let definitionEn = '';
    let example = '';
    
    if (data.meanings?.length > 0) {
      const meaning = data.meanings[0];
      if (meaning.definitions?.length > 0) {
        definitionEn = meaning.definitions[0].definition || '';
        example = meaning.definitions[0].example || '';
        
        // 如果第一个定义没有例句，寻找其他定义的例句
        if (!example) {
          for (const def of meaning.definitions.slice(1)) {
            if (def.example) {
              example = def.example;
              break;
            }
          }
        }
      }
    }

    return {
      success: true,
      data: {
        phonetic: phonetic ? `/${phonetic}/` : '',
        definitionEn,
        example
      }
    };
  } catch (error) {
    console.error(`Error fetching ${word}:`, error.message);
    return { success: false };
  }
}

// 从有道词典获取中文释义
async function fetchChineseDefinition(word: string): Promise<string> {
  try {
    const response = await axios.get(
      `https://dict.youdao.com/w/${encodeURIComponent(word)}`,
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    const $ = cheerio.load(response.data);
    return $('#phrsListTab .trans-container ul li').first().text() || '';
  } catch (error) {
    console.error(`Error fetching Chinese definition for ${word}:`, error.message);
    return '';
  }
}

// 加载进度
function loadProgress(): number {
  const progressPath = path.join(__dirname, 'crawl_progress.json');
  if (fs.existsSync(progressPath)) {
    try {
      const progress = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
      return progress.lastProcessedIndex || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

// 保存进度
function saveProgress(index: number, total: number) {
  const progressPath = path.join(__dirname, 'crawl_progress.json');
  fs.writeFileSync(progressPath, JSON.stringify({
    lastProcessedIndex: index,
    totalWords: total,
    timestamp: new Date().toISOString()
  }));
}

async function main() {
  try {
    // 读取单词列表
    const wordListPath = path.join(__dirname, 'ielts_core_words.txt');
    const words = fs.readFileSync(wordListPath, 'utf-8')
      .split('\n')
      .map(word => word.trim())
      .filter(word => word);

    console.log(`读取到 ${words.length} 个单词`);

    // 加载上次的进度
    const startIndex = loadProgress();
    console.log(`从第 ${startIndex + 1} 个单词继续处理`);

    // 清空数据库（如果从头开始）
    if (startIndex === 0) {
      await prisma.word.deleteMany();
      console.log('数据库已清空');
    }

    // 处理每个单词
    for (let i = startIndex; i < words.length; i++) {
      const word = words[i];
      console.log(`[${i + 1}/${words.length}] 处理: ${word}`);

      // 获取英文详细信息
      const details = await fetchWordDetails(word);
      await randomSleep();

      // 获取中文释义
      const definitionZh = await fetchChineseDefinition(word);
      await randomSleep();

      if (details.success) {
        try {
          await prisma.word.create({
            data: {
              id: `ielts-${i + 1}`,
              word,
              phonetic: details.data.phonetic,
              roots: '',
              affixes: '',
              etymology: '',
              definitionEn: details.data.definitionEn || `Definition not found for "${word}"`,
              definitionZh: definitionZh || `暂无中文释义`,
              example: details.data.example || '',
              lastReviewed: null,
              nextReview: null,
              reviewCount: 0,
              known: false
            }
          });

          // 每处理50个单词保存一次进度
          if ((i + 1) % 50 === 0) {
            saveProgress(i, words.length);
            console.log(`进度已保存: ${i + 1}/${words.length}`);
          }
        } catch (error) {
          console.error(`Error saving word ${word}:`, error);
          saveProgress(i, words.length);
        }
      } else {
        console.log(`跳过单词 ${word} (获取详情失败)`);
        saveProgress(i, words.length);
      }
    }

    console.log('所有单词处理完成！');
  } catch (error) {
    console.error('发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 启动爬虫
main().catch(console.error);
