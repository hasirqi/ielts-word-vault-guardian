// 批量更新扩展字段（难度等级、使用频率、分类等）
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 根据单词长度和复杂度估算难度等级
function estimateDifficulty(word) {
  if (word.length <= 4) return 1; // 简单
  if (word.length <= 6) return 2; // 较易
  if (word.length <= 8) return 3; // 中等
  if (word.length <= 10) return 4; // 较难
  return 5; // 困难
}

// 根据单词长度估算使用频率（简单词汇通常使用频率更高）
function estimateFrequency(word) {
  if (word.length <= 4) return Math.floor(Math.random() * 3) + 8; // 8-10
  if (word.length <= 6) return Math.floor(Math.random() * 3) + 6; // 6-8
  if (word.length <= 8) return Math.floor(Math.random() * 3) + 4; // 4-6
  if (word.length <= 10) return Math.floor(Math.random() * 3) + 2; // 2-4
  return Math.floor(Math.random() * 2) + 1; // 1-2
}

// 根据词性或词根分配基础分类
function estimateCategory(word, partOfSpeech) {
  if (partOfSpeech) {
    if (partOfSpeech.includes('noun')) return 'Academic';
    if (partOfSpeech.includes('verb')) return 'Action';
    if (partOfSpeech.includes('adjective')) return 'Descriptive';
    if (partOfSpeech.includes('adverb')) return 'Modifier';
  }
  
  // 基于单词特征的简单分类
  if (word.endsWith('tion') || word.endsWith('sion')) return 'Academic';
  if (word.endsWith('ing')) return 'Action';
  if (word.endsWith('ly')) return 'Modifier';
  if (word.endsWith('ful') || word.endsWith('less')) return 'Descriptive';
  
  return 'General';
}

async function batchUpdateExtendedFields() {
  try {
    const words = await prisma.word.findMany({
      orderBy: { sequenceNumber: 'asc' }
    });
    
    let updatedCount = 0;
    
    for (const w of words) {
      let dataToUpdate = {};
      
      // 更新难度等级（如果为空）
      if (!w.difficultyLevel) {
        dataToUpdate.difficultyLevel = estimateDifficulty(w.word);
      }
      
      // 更新使用频率（如果为空）
      if (!w.frequency) {
        dataToUpdate.frequency = estimateFrequency(w.word);
      }
      
      // 更新分类（如果为空）
      if (!w.category) {
        dataToUpdate.category = estimateCategory(w.word, w.partOfSpeech);
      }
      
      // 设置图片URL占位符（后续可以通过API获取）
      if (!w.imageUrl) {
        dataToUpdate.imageUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(w.word)}`;
      }
      
      // 生成简单的记忆提示
      if (!w.memoryTip) {
        if (w.roots && w.roots.trim()) {
          dataToUpdate.memoryTip = `记住词根: ${w.roots}`;
        } else if (w.word.length > 6) {
          dataToUpdate.memoryTip = `分解记忆: ${w.word.slice(0, 3)}-${w.word.slice(3)}`;
        } else {
          dataToUpdate.memoryTip = `联想记忆: ${w.word}`;
        }
      }
      
      if (Object.keys(dataToUpdate).length > 0) {
        await prisma.word.update({
          where: { sequenceNumber: w.sequenceNumber },
          data: dataToUpdate,
        });
        updatedCount++;
        
        if (updatedCount % 100 === 0) {
          console.log(`已处理 ${updatedCount} 个单词...`);
        }
      }
    }
    
    console.log(`已批量更新扩展字段：${updatedCount} 个单词。`);
  } catch (error) {
    console.error('批量更新失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

batchUpdateExtendedFields();
