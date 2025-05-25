import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = {
  academic: [
    'dissertation', 'methodology', 'synthesis', 'hypothesis', 'empirical',
    'thesis', 'abstract', 'analysis', 'research', 'interpretation',
    'evaluation', 'critique', 'framework', 'validity', 'reliability',
    'citation', 'reference', 'publication', 'journal', 'theoretical'
  ],
  environment: [
    'biodiversity', 'ecosystem', 'sustainability', 'conservation', 'renewable',
    'pollution', 'climate', 'extinction', 'habitat', 'organic',
    'environmental', 'ecological', 'greenhouse', 'emissions', 'deforestation',
    'recycling', 'preservation', 'contamination', 'atmosphere', 'ozone'
  ],
  technology: [
    'algorithm', 'artificial', 'automation', 'biotechnology', 'cybersecurity',
    'digital', 'encryption', 'innovation', 'nanotechnology', 'quantum',
    'semiconductor', 'interface', 'database', 'protocol', 'bandwidth',
    'authentication', 'blockchain', 'infrastructure', 'integration', 'robotics'
  ],
  business: [
    'entrepreneur', 'investment', 'corporation', 'stakeholder', 'portfolio',
    'dividend', 'revenue', 'liability', 'assets', 'subsidiary',
    'merger', 'acquisition', 'leverage', 'benchmark', 'compliance',
    'outsourcing', 'logistics', 'procurement', 'scalability', 'diversification'
  ],
  health: [
    'immunity', 'diagnosis', 'pathology', 'therapeutic', 'syndrome',
    'cardiovascular', 'vaccination', 'metabolism', 'nutrients', 'genetics',
    'neurology', 'endocrine', 'respiratory', 'physiological', 'antibodies',
    'epidemiology', 'immunology', 'pharmaceutical', 'psychological', 'rehabilitation'
  ]
};

async function main() {
  try {
    // 读取当前词汇列表
    const currentPath = path.join(__dirname, 'ielts_core_words.txt');
    const backupPath = path.join(__dirname, `ielts_core_words_${Date.now()}.txt`);
    
    const content = fs.readFileSync(currentPath, 'utf-8');
    const currentWords = new Set(content.split('\n').map(w => w.trim()).filter(Boolean));
    
    // 备份当前文件
    fs.copyFileSync(currentPath, backupPath);
    console.log(`当前词汇量: ${currentWords.size}`);
    
    // 添加新词汇
    let added = 0;
    Object.values(categories).flat().forEach(word => {
      if (!currentWords.has(word)) {
        currentWords.add(word);
        added++;
      }
    });
    
    // 保存更新后的词汇列表
    const sortedWords = Array.from(currentWords).sort();
    fs.writeFileSync(currentPath, sortedWords.join('\n'));
    
    console.log(`新增词汇: ${added}`);
    console.log(`更新后总词汇量: ${currentWords.size}`);
    console.log('词汇列表已更新并备份');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
