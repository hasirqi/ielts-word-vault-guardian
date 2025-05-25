// 测试API的简单脚本
const response = await fetch('http://localhost:5173/api/words');
const data = await response.json();
console.log('词汇总数:', data.length);
console.log('前3个词汇:');
data.slice(0, 3).forEach(word => {
  console.log(`- ${word.word} (${word.phonetic}): ${word.definitionEn}`);
});
