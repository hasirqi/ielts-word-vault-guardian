import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    console.log('API 请求开始 - 获取词汇数据');
    const startTime = Date.now();
    
    const words = await prisma.word.findMany({
      orderBy: [
        { lastReviewed: 'asc' },
        { word: 'asc' }
      ]
    });
    
    const endTime = Date.now();
    console.log(`从数据库获取到词汇数量: ${words.length}, 耗时: ${endTime - startTime}ms`);
    
    return new Response(JSON.stringify({ words }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('获取词汇数据失败:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch words' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}