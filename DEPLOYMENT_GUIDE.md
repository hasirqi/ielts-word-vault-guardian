# IELTS Word Vault Guardian - 云端部署指南

## 方案一：Vercel + Supabase (推荐)

### 1. 准备工作
- [ ] GitHub 账号
- [ ] Vercel 账号 (用GitHub登录)
- [ ] Supabase 账号 (用GitHub登录)

### 2. 数据库迁移 (SQLite → PostgreSQL)

#### 2.1 修改 Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // 改为 postgresql
  url      = env("DATABASE_URL")
}
```

#### 2.2 导出现有数据
```bash
# 导出 SQLite 数据
sqlite3 prisma/dev.db ".dump" > database_backup.sql

# 或使用 Prisma
npx prisma db pull
```

#### 2.3 在 Supabase 创建项目
1. 访问 https://supabase.com
2. 创建新项目
3. 获取连接字符串

### 3. 环境变量配置

#### 3.1 本地 .env 文件
```env
# Supabase 数据库连接
DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/[database]?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[password]@[host]:[port]/[database]"

# API Keys
PIXABAY_API_KEY="49179769-315165653ef98bc0ba64186b4"
GOOGLE_AI_API_KEY="your-gemini-api-key"  # 可选
```

### 4. 代码调整

#### 4.1 API 路由重构 (Vercel Functions)
- 将 `api-server.js` 改为 Vercel API Routes
- 创建 `api/` 目录

#### 4.2 构建配置
```json
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 5. 部署步骤

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Prepare for cloud deployment"
   git push origin main
   ```

2. **连接 Vercel**
   - 在 Vercel 导入 GitHub 仓库
   - 配置环境变量
   - 自动部署

3. **运行数据库迁移**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed  # 如果有 seed 文件
   ```

## 方案二：Railway (全栈部署)

### 优势
- 一站式部署前后端
- 内置 PostgreSQL
- 简单配置

### 配置文件
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 方案三：自建VPS

### 适合场景
- 需要完全控制
- 数据敏感性高
- 预算充足

### 基本配置
- Ubuntu 20.04+ 
- Node.js 18+
- Nginx (反向代理)
- PM2 (进程管理)
- SSL 证书

## 成本对比

| 方案 | 月费用 | 适用场景 |
|------|--------|----------|
| Vercel + Supabase | $0-20 | 个人/小团队 |
| Railway | $5-20 | 中小项目 |
| VPS | $5-50 | 企业/高要求 |

## 推荐流程

1. 🟢 **立即可用**: Vercel + Supabase 免费版
2. 🟡 **扩展需要**: 升级到付费版
3. 🔴 **企业需求**: 考虑自建或企业云

## 下一步

选择方案后，我可以帮您：
1. 修改代码适配云部署
2. 创建部署配置文件  
3. 设置 CI/CD 流程
4. 配置域名和SSL
