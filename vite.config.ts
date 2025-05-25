import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import express, { Request, Response } from "express";
import { PrismaClient, Word } from "@prisma/client";

// 创建单例 PrismaClient 实例，避免重复连接
let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || "file:./prisma/dev.db"
        },
      },
    });
    
    // 确保在进程结束时关闭连接
    process.on('beforeExit', async () => {
      await prismaInstance?.$disconnect();
    });
  }
  return prismaInstance;
}

// 创建API服务器中间件
function createApiServer() {
  const app = express();
  const prisma = getPrismaClient();
  
  app.use(express.json());
  // 获取所有单词 - 优化版本
  app.get('/api/words', async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      
      // 使用数据库连接池和优化查询
      const words = await prisma.word.findMany({
        orderBy: [
          { lastReviewed: 'asc' },
          { word: 'asc' }
        ]
      });
      
      const duration = Date.now() - startTime;
      console.log(`从数据库获取到词汇数量: ${words.length}, 耗时: ${duration}ms`);
      
      res.json(words);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`Error fetching words (${duration}ms):`, error);
      res.status(500).json({ error: 'Failed to fetch words' });
    }
  });

  // 新增单词 (单个)
  app.post('/api/words', async (req: Request, res: Response) => {
    try {
      const word = await prisma.word.create({ data: req.body as Word });
      res.json(word);
    } catch (error: any) {
      console.error('Error creating word:', error);
      res.status(500).json({ error: 'Failed to create word' });
    }
  });
  // 批量导入IELTS词汇表 - 优化版本
  app.post('/api/words/batch', async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      // 动态导入IELTS词汇表
      const vocabularyModule = await import('./src/data/vocabulary/index.js');
      const extendedIeltsWordList = vocabularyModule.extendedIeltsWordList;
      
      const requestWords = req.body;
      let wordsToImport;
      
      if (Array.isArray(requestWords) && requestWords.length > 0) {
        wordsToImport = requestWords;
      } else {
        wordsToImport = extendedIeltsWordList;
      }

      if (!wordsToImport || wordsToImport.length === 0) {
        console.error('没有找到词汇数据');
        return res.status(400).json({ success: false, error: '没有找到词汇数据' });
      }

      // 使用事务来优化批量操作
      const result = await prisma.$transaction(async (tx) => {
        // 先清空现有数据        // 清空现有数据并处理词汇数据
        await tx.word.deleteMany();
        const processedWords = wordsToImport.map((word: any) => {
          const processedWord: Partial<Word> & { id: string; word: string; } = {
            id: word.id,
            word: word.word,
            phonetic: word.phonetic,
            etymology: typeof word.etymology === 'object' ? 
              JSON.stringify(word.etymology) : word.etymology as string,
            definitionEn: word.definitions?.en || word.definitionEn || '',
            definitionZh: word.definitions?.zh || word.definitionZh || '',
            example: word.example,
            lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : null,
            nextReview: word.nextReview ? new Date(word.nextReview) : null,
            reviewCount: word.reviewCount || 0,
            known: word.known || false,
            roots: word.roots || null,
            affixes: word.affixes || null,
          };
          return processedWord as Word;
        });
          
        // 批量插入词汇
        const insertPromises = processedWords.map(word => 
          tx.word.create({ data: word })
        );
        await Promise.all(insertPromises);
        
        return processedWords.length;
      });

      const duration = Date.now() - startTime;
      console.log(`批量导入完成: ${result}个词汇, 耗时: ${duration}ms`);

      res.json({ 
        success: true, 
        count: result,
        source: Array.isArray(requestWords) && requestWords.length > 0 ? 'client' : 'ielts-vocabulary',
        duration: `${duration}ms`
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`批量导入词库失败 (${duration}ms):`, error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 更新单词状态
  app.put('/api/words/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const word = await prisma.word.update({ 
        where: { id }, 
        data: req.body as Partial<Word>
      });
      res.json(word);
    } catch (error: any) {
      console.error('Error updating word:', error);
      res.status(500).json({ error: 'Failed to update word' });
    }
  });

  // 删除单词
  app.delete('/api/words/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.word.delete({ where: { id } });
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting word:', error);
      res.status(500).json({ error: 'Failed to delete word' });
    }
  });

  // 清空词库
  app.post('/api/words/clear', async (req: Request, res: Response) => {
    try {
      await prisma.word.deleteMany();
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error clearing words:', error);
      res.status(500).json({ error: 'Failed to clear words' });
    }
  });

  // 更新单词复习状态
  app.put('/api/words/:id/review', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { known, lastReviewed, nextReview, reviewCount } = req.body;
      const updatedWord = await prisma.word.update({
        where: { id },
        data: {
          known,
          lastReviewed: lastReviewed ? new Date(lastReviewed) : null,
          nextReview: nextReview ? new Date(nextReview) : null,
          reviewCount,
        },
      });
      res.json(updatedWord);
    } catch (error: any) {
      console.error('Error updating word review status:', error);
      res.status(500).json({ error: 'Failed to update word review status' });
    }
  });

  return app;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    // 添加API服务器中间件
    {
      name: 'api-server',
      configureServer(server) {
        const apiApp = createApiServer();
        server.middlewares.use(apiApp);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
