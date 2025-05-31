# IELTS Word Vault Guardian

![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Supported-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

一个专为雅思词汇学习设计的现代化云端应用，支持卡片记忆、词汇库浏览、AI 智能补全、PWA 安装、移动端体验和云端数据同步。

---

<p align="center">
  <img src="public/screenshot-card.png" alt="单词卡片界面" width="350"/>
  <img src="public/screenshot-db.png" alt="词库浏览界面" width="350"/>
</p>

---

## 项目简介

- 词汇数据库：收录并扩展了雅思核心词汇，包含释义、音标、例句、词根词缀、同反义词、难度、频率、图片、记忆提示等。
- 前端技术：React + TypeScript + Vite + Tailwind CSS + shadcn-ui，响应式设计，支持移动端和桌面端。
- 后端/接口：Prisma ORM，支持本地 SQLite 和云端 PostgreSQL（Supabase）。
- AI 智能补全：集成 Google Gemini API，自动补全词汇信息。
- PWA 支持：可安装到手机桌面，离线体验。
- 云端部署：推荐 Vercel + Supabase，支持 CI/CD、域名绑定、SSL。

## 快速开始

### 本地开发

1. 克隆仓库
   ```powershell
   git clone https://github.com/hasirqi/ielts-word-vault-guardian.git
   cd ielts-word-vault-guardian
   ```
2. 安装依赖
   ```powershell
   npm install
   ```
3. 配置环境变量
   - 复制 `.env.example` 为 `.env`，填写数据库和 API Key 信息。
4. 启动开发服务器
   ```powershell
   npm run dev
   ```
5. （可选）本地数据库迁移与填充
   ```powershell
   npx prisma migrate dev
   node batch-update-words.js
   node batch-update-extended-fields.js
   ```

### 云端部署

详见 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

- 推荐 Vercel + Supabase 部署，支持自动化构建、云端数据库、PWA。
- 支持一键推送、自动部署、环境变量配置。

## 主要功能

- 雅思词汇卡片学习与复习（支持图片、例句、记忆法等）
- 词汇库浏览、搜索、筛选
- 学习进度统计与图表
- AI 智能补全词汇信息
- PWA 安装与离线体验
- 云端数据同步，随时随地访问

## 技术栈

- 前端：React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- 后端/API：Node.js, Prisma ORM, Supabase/PostgreSQL
- AI：Google Gemini API
- 部署：Vercel, Supabase

## 目录结构

- `src/` 前端源码（页面、组件、上下文、hooks、数据等）
- `prisma/` 数据库 schema、迁移、种子数据
- `api/` 云函数/API 路由（Vercel Functions）
- `public/` 静态资源、PWA 配置
- `batch-*.js`、`simple-import.js` 数据批量处理脚本
- `DEPLOYMENT_GUIDE.md` 云端部署详细指南

## 贡献与反馈

欢迎提交 Issue、PR 或建议！

## License

MIT License

---

# IELTS Word Vault Guardian (English)

![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Supported-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern cloud-based app for IELTS vocabulary learning, featuring card-based memorization, vocabulary browsing, AI-powered completion, PWA install, mobile experience, and cloud sync.

## Project Overview
- Vocabulary database: Extended IELTS core words with definitions, phonetics, examples, roots/affixes, synonyms/antonyms, difficulty, frequency, images, memory tips, etc.
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn-ui, responsive for mobile and desktop.
- Backend/API: Prisma ORM, supports local SQLite and cloud PostgreSQL (Supabase).
- AI completion: Integrated Google Gemini API for auto-completing word info.
- PWA: Installable on mobile, offline support.
- Cloud deployment: Recommended Vercel + Supabase, with CI/CD, custom domain, SSL.

## Quick Start

### Local Development
1. Clone the repo
   ```sh
   git clone https://github.com/hasirqi/ielts-word-vault-guardian.git
   cd ielts-word-vault-guardian
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Configure environment variables
   - Copy `.env.example` to `.env` and fill in DB/API keys.
4. Start dev server
   ```sh
   npm run dev
   ```
5. (Optional) Local DB migration & seed
   ```sh
   npx prisma migrate dev
   node batch-update-words.js
   node batch-update-extended-fields.js
   ```

### Cloud Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

- Recommended: Vercel + Supabase for automated build, cloud DB, PWA.
- One-click push, auto deploy, env config supported.

## Main Features
- IELTS word card learning & review (with images, examples, mnemonics, etc.)
- Vocabulary browsing, search, filter
- Learning progress stats & charts
- AI-powered word info completion
- PWA install & offline support
- Cloud sync, access anywhere

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- Backend/API: Node.js, Prisma ORM, Supabase/PostgreSQL
- AI: Google Gemini API
- Deployment: Vercel, Supabase

## Directory Structure
- `src/` Frontend source (pages, components, contexts, hooks, data, etc.)
- `prisma/` DB schema, migrations, seed data
- `api/` Cloud functions/API routes (Vercel Functions)
- `public/` Static assets, PWA config
- `batch-*.js`, `simple-import.js` Data batch scripts
- `DEPLOYMENT_GUIDE.md` Cloud deployment guide

## Contributing
Pull requests, issues, and suggestions are welcome!

## License
MIT License
