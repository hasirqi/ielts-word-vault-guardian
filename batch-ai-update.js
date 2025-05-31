// 使用 Google AI (Gemini) 智能补充词汇数据库空字段
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const prisma = new PrismaClient();

// 配置 Google AI
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 检查 API 密钥
if (!GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.error('❌ 请在 .env 文件中设置 GOOGLE_AI_API_KEY');
  console.log('获取方式: https://makersuite.google.com/app/apikey');
  process.exit(1);
}

// 构建智能提示词
function buildPrompt(word, existingData) {
  return `作为英语词汇专家，请为单词 "${word}" 补充以下信息。请返回JSON格式，只包含空缺的字段：

现有数据:
- 单词: ${word}
- 音标: ${existingData.phonetic || '未知'}
- 词性: ${existingData.partOfSpeech || '未知'}  
- 英文定义: ${existingData.definitionEn || '未知'}
- 中文定义: ${existingData.definitionZh || '未知'}
- 例句: ${existingData.example || '未知'}

需要补充的字段（只填写空缺的）:
${!existingData.phonetic ? '- phonetic: IPA音标（如 /ˈwɜːrd/）' : ''}
${!existingData.partOfSpeech ? '- partOfSpeech: 词性（noun, verb, adjective, adverb等）' : ''}
${!existingData.definitionZh ? '- definitionZh: 准确的中文释义' : ''}
${!existingData.synonyms ? '- synonyms: 3-5个同义词，逗号分隔' : ''}
${!existingData.antonyms ? '- antonyms: 2-3个反义词，逗号分隔（如果有）' : ''}
${!existingData.roots ? '- roots: 词根（如果有明确词根）' : ''}
${!existingData.affixes ? '- affixes: 词缀，包括前缀后缀（如果有）' : ''}
${!existingData.etymology ? '- etymology: 简短词源说明' : ''}
${!existingData.memoryTip ? '- memoryTip: 实用的记忆技巧或联想方法' : ''}

要求：
1. 音标使用标准IPA格式
2. 中文释义要准确、简洁
3. 同义词要常用且准确  
4. 记忆技巧要实用有趣
5. 只返回JSON格式，不要其他解释

JSON格式示例:
{
  "phonetic": "/ˈeksæmpl/",
  "definitionZh": "例子，实例",
  "synonyms": "instance, sample, case",
  "memoryTip": "ex(外)+ample(充足) = 外部充足的证明 = 例子"
}`;
}

// 使用 AI 获取单词数据
async function fetchAIData(word, existingData) {
  try {
    const prompt = buildPrompt(word, existingData);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 尝试解析 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiData = JSON.parse(jsonMatch[0]);
      return aiData;
    } else {
      console.log(`⚠️  ${word}: AI返回格式不正确`);
      return {};
    }
  } catch (error) {
    console.error(`❌ ${word}: AI获取失败 -`, error.message);
    return {};
  }
}

// 检查字段是否需要更新
function needsUpdate(value) {
  return !value || 
         value.toString().trim() === '' || 
         value.toString().includes('待爬虫更新') || 
         value.toString().includes('演示') ||
         value.toString().includes('to be updated') ||
         value.toString().includes('placeholder') ||
         value.toString().includes('NULL');
}

// 主要处理函数
async function batchAIUpdate() {
  try {
    console.log('🚀 开始使用 Google AI 补充词汇数据...\n');
    
    // 获取需要更新的单词
    const words = await prisma.word.findMany({
      orderBy: { sequenceNumber: 'asc' }
    });
    
    let processedCount = 0;
    let updatedCount = 0;
    const batchSize = 10; // 控制API调用频率
    
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      
      for (const word of batch) {
        // 检查哪些字段需要更新
        const needsPhoneticUpdate = needsUpdate(word.phonetic);
        const needsPartOfSpeechUpdate = needsUpdate(word.partOfSpeech);
        const needsDefZhUpdate = needsUpdate(word.definitionZh);
        const needsSynonymsUpdate = needsUpdate(word.synonyms);
        const needsAntonymsUpdate = needsUpdate(word.antonyms);
        const needsRootsUpdate = needsUpdate(word.roots);
        const needsAffixesUpdate = needsUpdate(word.affixes);
        const needsEtymologyUpdate = needsUpdate(word.etymology);
        const needsMemoryTipUpdate = needsUpdate(word.memoryTip);
        
        const needsAnyUpdate = needsPhoneticUpdate || needsPartOfSpeechUpdate || 
                              needsDefZhUpdate || needsSynonymsUpdate || 
                              needsAntonymsUpdate || needsRootsUpdate || 
                              needsAffixesUpdate || needsEtymologyUpdate || 
                              needsMemoryTipUpdate;
        
        if (!needsAnyUpdate) {
          processedCount++;
          continue;
        }
        
        console.log(`🔍 处理单词: ${word.word} (${processedCount + 1}/${words.length})`);
        
        // 使用 AI 获取数据
        const aiData = await fetchAIData(word.word, word);
        
        // 构建更新数据
        let dataToUpdate = {};
        
        if (needsPhoneticUpdate && aiData.phonetic) {
          dataToUpdate.phonetic = aiData.phonetic;
        }
        if (needsPartOfSpeechUpdate && aiData.partOfSpeech) {
          dataToUpdate.partOfSpeech = aiData.partOfSpeech;
        }
        if (needsDefZhUpdate && aiData.definitionZh) {
          dataToUpdate.definitionZh = aiData.definitionZh;
        }
        if (needsSynonymsUpdate && aiData.synonyms) {
          dataToUpdate.synonyms = aiData.synonyms;
        }
        if (needsAntonymsUpdate && aiData.antonyms) {
          dataToUpdate.antonyms = aiData.antonyms;
        }
        if (needsRootsUpdate && aiData.roots) {
          dataToUpdate.roots = aiData.roots;
        }
        if (needsAffixesUpdate && aiData.affixes) {
          dataToUpdate.affixes = aiData.affixes;
        }
        if (needsEtymologyUpdate && aiData.etymology) {
          dataToUpdate.etymology = aiData.etymology;
        }
        if (needsMemoryTipUpdate && aiData.memoryTip) {
          dataToUpdate.memoryTip = aiData.memoryTip;
        }
        
        // 更新数据库
        if (Object.keys(dataToUpdate).length > 0) {
          await prisma.word.update({
            where: { sequenceNumber: word.sequenceNumber },
            data: dataToUpdate,
          });
          updatedCount++;
          
          const updateFields = Object.keys(dataToUpdate).join(', ');
          console.log(`  ✅ 已更新字段: ${updateFields}`);
        } else {
          console.log(`  ⚠️  AI未返回有效数据`);
        }
        
        processedCount++;
        
        // 避免API限制，添加延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`\n📊 进度: 已处理 ${Math.min(i + batchSize, words.length)}/${words.length} 个单词\n`);
    }
    
    console.log(`\n🎉 AI补充完成！`);
    console.log(`📈 统计: 处理 ${processedCount} 个单词，更新 ${updatedCount} 个单词`);
    
  } catch (error) {
    console.error('❌ AI补充失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
if (require.main === module) {
  batchAIUpdate();
}

module.exports = { batchAIUpdate };
