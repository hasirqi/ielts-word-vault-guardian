import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface WordData {
  id: string;
  word: string;
  phonetic: string;
  etymology: {
    roots: string;
    affixes: string;
    explanation: string;
  };
  definitions: {
    en: string;
    zh: string;
  };
  example: string;
  lastReviewed: null;
  nextReview: null;
  reviewCount: number;
}

async function fetchWordData(word: string, index: number): Promise<WordData> {
  try {
    // 这里使用 Free Dictionary API 作为示例
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = response.data[0];

    return {
      id: String(index + 1),
      word: word,
      phonetic: data.phonetic || '',
      etymology: {
        roots: '',  // 需要从其他API获取
        affixes: '',
        explanation: data.origin || ''
      },
      definitions: {
        en: data.meanings[0]?.definitions[0]?.definition || '',
        zh: ''  // 需要从翻译API获取
      },
      example: data.meanings[0]?.definitions[0]?.example || '',
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0
    };
  } catch (error) {
    console.error(`Error fetching data for word: ${word}`, error);
    return null;
  }
}

async function main() {  // 从文件读取IELTS高频词列表
  const { ieltsWordList } = require('./wordList');
  const wordList = ieltsWordList;

  const results: WordData[] = [];
  
  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i];
    const data = await fetchWordData(word, i);
    if (data) {
      results.push(data);
    }
    
    // 每100个词保存一次，防止数据丢失
    if (i % 100 === 0) {
      const outputPath = path.join(__dirname, '../src/data/generatedWords.ts');
      const content = `export const generatedWords = ${JSON.stringify(results, null, 2)};`;
      fs.writeFileSync(outputPath, content);
      console.log(`Processed ${i + 1} words`);
    }
  }
}

main().catch(console.error);
