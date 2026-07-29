# AI Insight Factory - 开发计划

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 15 (App Router) + TypeScript |
| ORM | Prisma + PostgreSQL |
| UI | Tailwind CSS + shadcn/ui |
| AI | Vercel AI SDK (`ai` + `@ai-sdk/openai` 兼容 Deepseek) |
| RSS | rss-parser |
| 定时任务 | node-cron |
| 搜索 | PostgreSQL tsvector 全文索引 |
| 部署 | VPS + pm2 或 Railway |

## 项目结构

```
src/
├── app/
│   ├── (public)/              # 前台
│   │   ├── page.tsx           # 首页
│   │   ├── article/[slug]/page.tsx
│   │   ├── category/[slug]/page.tsx
│   │   ├── daily/page.tsx
│   │   ├── weekly/page.tsx
│   │   └── search/page.tsx
│   ├── admin/                 # 后台
│   │   ├── dashboard/page.tsx
│   │   ├── feeds/page.tsx
│   │   ├── articles/page.tsx
│   │   ├── content-factory/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── feeds/route.ts
│   │   ├── articles/route.ts
│   │   ├── generate/route.ts
│   │   └── cron/[task]/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── rss.xml/route.ts
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── layout/
│   ├── article/
│   └── admin/
├── lib/
│   ├── db.ts
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── prompts.ts
│   │   └── generators.ts
│   ├── feed/
│   │   ├── parser.ts
│   │   └── dedup.ts
│   └── utils.ts
└── jobs/
    ├── feed-import.ts
    ├── ai-process.ts
    ├── daily-digest.ts
    └── weekly-report.ts
prisma/
├── schema.prisma
└── seed.ts
__tests__/
├── unit/
├── integration/
├── api/
├── e2e/
└── ai/
```

## Sprint 拆分

### Sprint 1：基础骨架 + RSS 采集

1. 项目初始化（Next.js + Tailwind + shadcn/ui + 依赖）
2. Prisma Schema + 迁移 + Seed
3. RSS 采集（parser + dedup + job + cron API）
4. 前台页面（首页、文章详情、分类、布局）
5. 后台基础（Admin 布局、Dashboard、Feed CRUD）

### Sprint 2：AI 处理引擎

6. AI Service 抽象层（多 provider 切换）
7. 摘要 + 分类 + 标签 + 重要度生成
8. 搜索功能（tsvector 全文索引）

### Sprint 3：内容工厂

9. Prompt 管理系统（Setting 表 + 后台编辑）
10. 公众号文章生成（1200-2500 字）
11. 小红书笔记生成（300-800 字）
12. 生成内容管理（预览/编辑/重新生成/导出）

### Sprint 4：日报/周报 + SEO + 分发

13. 日报/周报自动生成
14. SEO（sitemap / robots / rss.xml / metadata）
15. 定时任务调度（node-cron）
16. 分发（Markdown 导出、RSS 输出）

## 数据库设计

- Feed: RSS 来源（name, url, category, isActive, lastFetched）
- Article: 文章（title, slug, link, content, summary, importance, aiCategory, publishedAt）
- Tag / ArticleTag: 标签多对多
- GeneratedContent: AI 生成内容（contentType: wechat/xiaohongshu/weekly/newsletter/analysis/daily）
- Digest: 日报/周报
- Setting: 系统配置（API Key, Prompt 模板, 模型选择）

## AI Provider 配置

- 主 provider: Deepseek（OpenAI 兼容，baseURL: https://api.deepseek.com）
- 备选: OpenAI / Claude / Gemini / OpenRouter
- 通过 Setting 表动态切换，后台可配置

## 定时任务

| 任务 | 频率 |
|------|------|
| feed-import | 每 30 分钟 |
| ai-process | 每小时 |
| daily-digest | 每天 07:00 |
| weekly-report | 每周日 08:00 |

## 测试方案

### 单元测试（Vitest）

- RSS 解析：正常/Atom/空Feed/异常XML/编码/超时/HTTP错误
- 去重：相同link/相同标题/相似标题
- AI 生成：摘要/分类/标签/重要度/格式异常/超时/fallback
- 内容生成：公众号字数/小红书格式/日报/周报/空数据
- 工具函数：slug 生成/去重/中文处理/HTML 清洗

### 集成测试

- 采集全链路：触发 → 解析 → 入库 → 去重
- AI 处理全链路：采集 → 摘要/分类/标签填充
- 内容生成全链路：选文章 → 生成 → 存储
- 日报/周报全链路
- 搜索：入库 → 搜索 → 排序
- 级联删除

### API 测试

- Feed CRUD（含唯一性校验、409）
- 文章列表（分页、筛选、搜索）
- 内容生成（正常、缺参数 400）
- Cron 接口鉴权（401 / 200）

### E2E 测试（Playwright）

- 前台：首页/文章详情/分类/搜索/日报/RSS/响应式
- 后台：登录/鉴权/Feed管理/内容生成/Prompt编辑/Dashboard

### AI 真实调用测试（@ai-integration）

- Deepseek 连通性
- 摘要质量（<200字，语义完整）
- 分类准确率（>80%）
- 公众号/小红书格式校验
- Rate limit / 长文本

### 非功能测试

- 性能：首页 LCP <2s，搜索 <500ms，批量 AI <5min
- 安全：XSS 转义、SQL 注入（Prisma 参数化）、Cron 鉴权
- 稳定性：网络中断恢复、AI 不可用队列暂停
