// 批量为IELTS词汇数据库补全真实释义（英文释义/音标/例句/中文释义），不覆盖已有内容
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

// 获取英文释义、音标、例句（Free Dictionary API）
async function fetchEnData(word) {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const res = await axios.get(url, { timeout: 8000 });
    const data = res.data && res.data[0];
    if (!data) return {};
    
    // 提取词性
    const partOfSpeech = data.meanings?.[0]?.partOfSpeech || '';
    
    // 提取同义词
    const synonymsArray = [];
    data.meanings?.forEach(meaning => {
      meaning.definitions?.forEach(def => {
        if (def.synonyms && def.synonyms.length > 0) {
          synonymsArray.push(...def.synonyms);
        }
      });
    });
    const synonyms = [...new Set(synonymsArray)].slice(0, 5).join(', '); // 去重并限制数量
    
    // 提取反义词
    const antonymsArray = [];
    data.meanings?.forEach(meaning => {
      meaning.definitions?.forEach(def => {
        if (def.antonyms && def.antonyms.length > 0) {
          antonymsArray.push(...def.antonyms);
        }
      });
    });
    const antonyms = [...new Set(antonymsArray)].slice(0, 5).join(', '); // 去重并限制数量
    
    return {
      phonetic: data.phonetic || (data.phonetics && data.phonetics[0]?.text) || '',
      definitionEn: data.meanings?.[0]?.definitions?.[0]?.definition || '',
      example: data.meanings?.[0]?.definitions?.[0]?.example || '',
      partOfSpeech: partOfSpeech,
      synonyms: synonyms,
      antonyms: antonyms
    };
  } catch {
    return {};
  }
}

// 获取中文释义（有道API，演示用，实际可换为你自己的API KEY或爬虫）
async function fetchZhData(word) {
  try {
    // 这里只做演示，实际可用有道、金山等API
    const url = `https://dict.youdao.com/jsonapi?q=${encodeURIComponent(word)}`;
    const res = await axios.get(url, { timeout: 8000 });
    const zh = res.data.ec?.word?.[0]?.trs?.[0]?.tr?.[0]?.l?.i?.[0] || '';
    return zh;
  } catch {
    return '';
  }
}

// 获取词根/词缀（有道词典风格，尝试解析词根词缀说明）
async function fetchRootsAffixes(word) {
  try {
    // 有道词典网页版结构分析，部分单词有词根词缀说明
    const url = `https://dict.youdao.com/result?word=${encodeURIComponent(word)}&lang=en`;
    const res = await axios.get(url, { timeout: 8000 });
    const html = res.data;
    // 简单正则提取“词根词缀”相关内容（可根据实际页面结构优化）
    const rootMatch = html.match(/词根：(.*?)<\/span>/);
    const affixMatch = html.match(/词缀：(.*?)<\/span>/);
    // 修正正则表达式，防止语法错误
    // const rootMatch = html.match(/词根：(.*?)<\/span>/);
    // const affixMatch = html.match(/词缀：(.*?)<\/span>/);
    return {
      roots: rootMatch ? rootMatch[1].replace(/<.*?>/g, '').trim() : '',
      affixes: affixMatch ? affixMatch[1].replace(/<.*?>/g, '').trim() : ''
    };
  } catch {
    return { roots: '', affixes: '' };
  }
}

async function batchFetchWords() {
  try {
    const words = await prisma.word.findMany({
      orderBy: { sequenceNumber: 'asc' } 
    });
    let updatedCount = 0;    for (const w of words) {
      const needsPhoneticUpdate = !w.phonetic || w.phonetic.trim() === '' || w.phonetic.includes('[a-demo]');
      const needsDefEnUpdate = !w.definitionEn || w.definitionEn.trim() === '' || w.definitionEn.includes('to be updated by crawler');
      const needsDefZhUpdate = !w.definitionZh || w.definitionZh.trim() === '' || w.definitionZh.includes('待爬虫更新') || w.definitionZh.includes('演示');
      const needsExampleUpdate = !w.example || w.example.trim() === '' || (w.example && w.example.includes('演示'));
      const needsRootsUpdate = !w.roots || w.roots.trim() === '' || w.roots.includes('词根演示');
      const needsAffixesUpdate = !w.affixes || w.affixes.trim() === '' || w.affixes.includes('词缀演示');
      const needsPartOfSpeechUpdate = !w.partOfSpeech || w.partOfSpeech.trim() === '';
      const needsSynonymsUpdate = !w.synonyms || w.synonyms.trim() === '';
      const needsAntonymsUpdate = !w.antonyms || w.antonyms.trim() === '';

      const needsAnyUpdate = needsPhoneticUpdate || needsDefEnUpdate || needsDefZhUpdate || needsExampleUpdate || 
                            needsRootsUpdate || needsAffixesUpdate || needsPartOfSpeechUpdate || 
                            needsSynonymsUpdate || needsAntonymsUpdate;

      if (!needsAnyUpdate) {
        continue;
      }

      // Fetch data only if an update is needed
      console.log(`Fetching data for: ${w.word}`);
      const en = await fetchEnData(w.word);
      const zh = await fetchZhData(w.word);
      const ra = await fetchRootsAffixes(w.word);

      let dataToUpdate = {};

      if (needsPhoneticUpdate) {
        dataToUpdate.phonetic = en.phonetic || '';
      }
      if (needsDefEnUpdate) {
        dataToUpdate.definitionEn = en.definitionEn || '';
      }
      if (needsDefZhUpdate) {
        dataToUpdate.definitionZh = (typeof zh === 'string' ? zh : '') || '';
      }
      if (needsExampleUpdate) {
        dataToUpdate.example = en.example || '';
      }
      if (needsRootsUpdate) {
        dataToUpdate.roots = ra.roots || '';
      }
      if (needsAffixesUpdate) {
        dataToUpdate.affixes = ra.affixes || '';
      }
      if (needsPartOfSpeechUpdate) {
        dataToUpdate.partOfSpeech = en.partOfSpeech || '';
      }
      if (needsSynonymsUpdate) {
        dataToUpdate.synonyms = en.synonyms || '';
      }
      if (needsAntonymsUpdate) {
        dataToUpdate.antonyms = en.antonyms || '';
      }

      if (Object.keys(dataToUpdate).length > 0) {
        // Check if any actual change will occur compared to current values after placeholder removal        let actualChanges = false;
        for (const key in dataToUpdate) {
            if (dataToUpdate[key] !== w[key]) {
                // Special check for placeholders: if current w[key] is a placeholder and dataToUpdate[key] is empty, it's a change.
                if ( (key === 'phonetic' && needsPhoneticUpdate) ||
                     (key === 'definitionEn' && needsDefEnUpdate) ||
                     (key === 'definitionZh' && needsDefZhUpdate) ||
                     (key === 'example' && needsExampleUpdate) ||
                     (key === 'roots' && needsRootsUpdate) ||
                     (key === 'affixes' && needsAffixesUpdate) ||
                     (key === 'partOfSpeech' && needsPartOfSpeechUpdate) ||
                     (key === 'synonyms' && needsSynonymsUpdate) ||
                     (key === 'antonyms' && needsAntonymsUpdate) ) {
                    actualChanges = true;
                    break;
                }
            }
        }

        // Only update if there are actual changes to be made
        // This check might be redundant if the above needsXUpdate flags are accurate
        // and dataToUpdate construction is correct. The primary goal is to ensure
        // placeholders are overwritten even if API returns empty.
        // The previous Object.keys(dataToUpdate).length > 0 is usually sufficient here.

        await prisma.word.update({
          where: { sequenceNumber: w.sequenceNumber },
          data: dataToUpdate,
        });
        updatedCount++;
        console.log(`Updated word: ${w.word} (Total processed for update: ${updatedCount})`);
      }
    }
    console.log(`已批量补全真实释义和词根词缀：${updatedCount} 个单词。`);
  } catch (error) {
    console.error('批量补全失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

batchFetchWords();
