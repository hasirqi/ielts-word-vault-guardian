import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// 防止被封禁，添加随机延迟
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomSleep = () => sleep(Math.random() * 2000 + 1000);

// 从 Free Dictionary API 获取单词详细信息
async function fetchWordDetails(word: string) {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const response = await axios.get(url);
    const data = response.data[0];

    // 提取音标
    let phonetic = data.phonetic || '';
    if (!phonetic && data.phonetics && data.phonetics.length > 0) {
      // 尝试找到有音标的项
      const phoneticData = data.phonetics.find(p => p.text) || data.phonetics[0];
      phonetic = phoneticData?.text || '';
    }

    // 提取英文释义和例句
    let definitionEn = '';
    let example = '';
    let partOfSpeech = '';
    let roots = '';
    let affixes = '';

    if (data.meanings && data.meanings.length > 0) {
      // 优先使用第一个词性的定义
      const meaning = data.meanings[0];
      partOfSpeech = meaning.partOfSpeech || '';

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

      // 模拟提取词根和词缀（实际需要更复杂的逻辑或数据源）
      roots = `Root of ${word}`;
      affixes = `Affixes of ${word}`;
    }

    await randomSleep();

    return {
      phonetic: `/${phonetic}/`,
      definitionEn,
      example,
      roots,
      affixes
    };
  } catch (error) {
    console.error(`Error fetching details for word: ${word}`, error.message);
    return null;
  }
}

// 从有道词典获取中文释义
async function fetchChineseDefinition(word: string) {
  try {
    const url = `https://dict.youdao.com/w/${encodeURIComponent(word)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const definitionZh = $('#phrsListTab .trans-container ul li').first().text() || '';
    
    await randomSleep();
    
    return definitionZh;
  } catch (error) {
    console.error(`Error fetching Chinese definition for word: ${word}`, error.message);
    return '';
  }
}

// 读取核心词汇列表
async function readWordList() {
  // 这里先用一个基础的IELTS核心词汇列表，后续可以扩充
  const wordListPath = path.join(__dirname, 'ielts_core_words.txt');
  if (!fs.existsSync(wordListPath)) {
    throw new Error('Word list file not found!');
  }
  const content = fs.readFileSync(wordListPath, 'utf-8');
  return content.split('\n').map(word => word.trim()).filter(word => word);
}

async function main() {
  try {
    console.log('开始爬取词汇数据...');
    
    // 读取词汇列表
    const words = await readWordList();
    console.log(`总共读取到 ${words.length} 个单词`);

    // 清空现有数据库
    await prisma.word.deleteMany();
    console.log('数据库已清空，准备导入新数据');

    // 批量处理单词
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      console.log(`处理第 ${i + 1}/${words.length} 个单词: ${word}`);

      const details = await fetchWordDetails(word);
      const definitionZh = await fetchChineseDefinition(word);

      if (details) {
        try {
          await prisma.word.create({
            data: {
              id: `ielts-${i + 1}`,
              word,
              phonetic: details.phonetic || '',
              roots: details.roots || '', // 词根信息
              affixes: details.affixes || '', // 词缀信息
              etymology: '', // 词源信息需要其他来源
              definitionEn: details.definitionEn || `Definition for "${word}" not found`,
              definitionZh: definitionZh || `暂无中文释义`,
              example: details.example || '',
              lastReviewed: null,
              nextReview: null,
              reviewCount: 0,
              known: false
            }
          });
        } catch (error) {
          console.error(`保存单词 ${word} 时出错:`, error);
        }
      }

      // 防止请求过快
      await randomSleep();
    }

    console.log('单词爬取和导入完成！');
  } catch (error) {
    console.error('发生错误:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
