# AI Insight Factory

## 产品需求规格书（SRS + PRD）

版本：V1.0

---

# 1. 项目定位

AI Insight Factory 是一个面向 AI 行业的信息采集、情报分析、内容生成与内容分发平台。

系统自动从 RSS、GitHub、技术博客等来源采集 AI 行业动态，通过大模型进行摘要、分类、标签化处理，并自动生成微信公众号文章、小红书笔记、周报与 Newsletter。

目标是打造一个：

```text
AI情报采集
    ↓
AI分析
    ↓
AI内容生产
    ↓
人工审核
    ↓
内容分发
```

完整闭环平台。

---

# 2. 项目目标

## MVP目标

实现：

- RSS自动采集
- 新闻聚合
- AI摘要
- AI标签分类
- AI生成公众号文章
- AI生成小红书笔记
- AI生成周报
- 搜索与归档

## V2目标

- AI趋势分析
- Agent数据库
- MCP数据库
- 模型数据库
- 邮件订阅

## V3目标

- 自动内容发布
- 多平台账号管理
- AI编辑助手
- AI热点预测

---

# 3. 技术架构

## 环境

- PHP 8.2+
- MySQL 8+
- Apache/Nginx
- cPanel
- Cron Job

## AI服务

统一接口：

- OpenAI
- Claude
- Gemini
- OpenRouter

---

# 4. 系统模块

## 模块一：信息采集中心

功能：

- RSS导入
- Feed管理
- 去重处理
- 定时采集

目录：

```text
/cron/feed-import.php
```

执行频率：

```text
每30分钟
```

---

## 模块二：情报处理中心

功能：

- AI摘要
- AI关键词提取
- AI分类
- AI重要度评估

重要等级：

```text
High
Medium
Low
```

---

## 模块三：内容工厂

支持生成：

### 微信公众号

长度：

```text
1200-2500字
```

结构：

- 吸引人的标题
- 问题导入
- 事件介绍
- 行业影响
- 趋势预测
- 互动讨论

### 小红书

结构：

- Emoji风格
- 分点输出
- 热门标签
- CTA互动

字数：

```text
300-800字
```

### 每日快讯

输出：

```text
Top 10 AI News
```

### 周报

输出：

```text
Weekly AI Report
```

### 深度分析

输出：

```text
某主题发展趋势分析
```

---

## 模块四：内容分发中心

支持：

- 邮件订阅
- RSS输出
- Telegram推送
- Markdown导出

V2支持：

- 微信公众号素材导出
- 小红书素材导出

---

# 5. 数据源设计

## AI厂商

- OpenAI
- Anthropic
- Google AI
- Microsoft AI
- Meta AI
- Mistral
- Cohere
- xAI

## 社区

- Hacker News
- GitHub Trending
- Reddit AI

## 开源生态

- Hugging Face
- GitHub Releases

---

# 6. 数据库设计

## feeds

保存RSS来源。

## articles

保存新闻。

字段：

- id
- source
- title
- link
- content
- summary
- importance
- published_at

## tags

标签表。

## article_tags

新闻与标签关联。

## generated_content

存储AI生成内容。

字段：

- id
- article_id
- content_type
- title
- content
- created_at

content_type:

```text
wechat
xiaohongshu
weekly
newsletter
analysis
```

## digests

日报与周报。

---

# 7. 分类体系

## AI Models

关键词：

- GPT
- Claude
- Gemini
- Llama
- Qwen
- DeepSeek

## AI Agents

关键词：

- Agent
- Agentic
- Workflow

## MCP

关键词：

- MCP
- Model Context Protocol

## Open Source

关键词：

- GitHub
- Open Source

## Funding

关键词：

- Funding
- VC
- Series A
- Investment

## Research

关键词：

- Paper
- Research

---

# 8. 前台页面

## 首页

URL

```text
/
```

内容：

- 热门资讯
- 最新资讯
- AI日报
- 分类导航

## 文章详情页

```text
/article/{slug}
```

内容：

- 标题
- 来源
- 发布时间
- AI摘要
- 原文链接
- 推荐阅读

## 分类页

```text
/category/models
/category/agents
/category/mcp
```

## 搜索页

支持：

- 标题搜索
- 全文搜索
- 标签搜索

## AI日报

```text
/daily
```

## AI周报

```text
/weekly
```

---

# 9. 后台管理

## 仪表盘

展示：

- 今日采集数
- 本周采集数
- AI生成数
- 热门标签

## Feed管理

- 新增
- 编辑
- 删除
- 启用
- 禁用

## 内容管理

- 查看
- 删除
- 重生成摘要
- 重生成标签

## 内容工厂

按钮：

- 生成公众号
- 生成小红书
- 生成周报
- 生成Newsletter

## 系统配置

- API Key
- Prompt管理
- 模型选择

---

# 10. AI Prompt设计

## 新闻摘要Prompt

输出：

- 一句话摘要
- 核心变化
- 影响分析
- 行动建议

## 公众号Prompt

输出：

- 标题
- 引言
- 正文
- 总结
- 互动问题

## 小红书Prompt

输出：

- 标题
- Emoji优化
- 正文
- 标签列表

---

# 11. SEO设计

生成：

- sitemap.xml
- robots.txt
- rss.xml

URL规范：

```text
/article/openai-launches-new-model
```

---

# 12. 定时任务

## Feed采集

每30分钟。

## AI摘要

每小时。

## 日报生成

每天07:00。

## 周报生成

每周日08:00。

---

# 13. 开发里程碑

## Sprint 1

- 用户界面
- 数据库
- RSS采集

## Sprint 2

- 摘要生成
- 标签生成
- 搜索

## Sprint 3

- 公众号内容生成
- 小红书内容生成

## Sprint 4

- 日报
- 周报
- SEO

---

# 14. 验收标准

系统上线后应满足：

- 自动采集RSS
- 自动去重
- 自动生成摘要
- 自动标签分类
- 自动生成公众号文章
- 自动生成小红书内容
- 支持日报与周报
- 支持全文搜索
- 支持SEO优化
- 支持5GB空间长期运行

---

# 最终产品定位

AI Insight Factory 不仅是 AI 情报站，而是一个：

```text
AI情报中心
+
AI内容工厂
+
AI媒体后台
```

帮助个人站长、AI博主、自媒体团队和内容创业者，实现从信息获取到内容生产的自动化流程。
