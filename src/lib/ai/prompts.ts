export const SUMMARY_SYSTEM = `你是一个AI行业新闻分析专家。请对用户提供的新闻进行分析，输出JSON格式。`;

export const SUMMARY_PROMPT = (title: string, content: string) => `
请分析以下AI行业新闻，输出JSON：

标题：${title}
内容：${content || title}

输出格式：
{
  "summary": "一句话中文摘要（50字以内）",
  "keyChange": "核心变化（30字以内）",
  "impact": "行业影响分析（50字以内）",
  "suggestion": "行动建议（30字以内）"
}
`;

export const CLASSIFY_PROMPT = (title: string, content: string) => `
请对以下AI新闻进行分类和标签提取，输出JSON：

标题：${title}
内容：${content || title}

可选分类：models, agents, mcp, opensource, funding, research, other

输出格式：
{
  "category": "分类（从可选分类中选一个）",
  "tags": ["标签1", "标签2", "标签3"],
  "importance": "HIGH 或 MEDIUM 或 LOW"
}

重要度判断标准：
- HIGH: 重大产品发布、大额融资、突破性研究
- MEDIUM: 常规更新、行业分析、工具推荐
- LOW: 一般讨论、转载、旧闻
`;

export const WECHAT_SYSTEM = `你是一个资深科技自媒体作者，擅长写微信公众号文章。风格：专业但不枯燥，有洞察力，善于用类比解释技术概念。`;

export const WECHAT_PROMPT = (title: string, summary: string, content: string) => `
请基于以下新闻素材，撰写一篇微信公众号文章。

新闻标题：${title}
新闻摘要：${summary}
原文内容：${content || summary}

要求：
1. 字数：1200-2500字
2. 结构：
   - 吸引人的标题（可用数字、疑问、对比）
   - 问题导入（为什么读者应该关心）
   - 事件介绍（发生了什么）
   - 行业影响（对行业意味着什么）
   - 趋势预测（未来会怎样）
   - 互动讨论（引导读者评论）
3. 语言：中文，专业但易读
4. 输出JSON格式：{"title": "文章标题", "content": "文章正文（用\\n分段）"}
`;

export const XIAOHONGSHU_SYSTEM = `你是一个小红书爆款内容创作者，擅长用轻松活泼的语气分享科技资讯。`;

export const XIAOHONGSHU_PROMPT = (title: string, summary: string) => `
请基于以下AI新闻，创作一篇小红书笔记。

新闻标题：${title}
新闻摘要：${summary}

要求：
1. 字数：300-800字
2. 风格：
   - 标题带Emoji，吸引眼球
   - 正文分点输出，每点带Emoji
   - 语气轻松、有感染力
   - 结尾带CTA互动（点赞/收藏/评论引导）
3. 包含5-8个相关话题标签（#xxx格式）
4. 输出JSON格式：{"title": "笔记标题", "content": "笔记正文", "tags": ["#标签1", "#标签2"]}
`;

export const DAILY_PROMPT = (articles: { title: string; summary: string; category: string }[]) => `
请基于以下今日AI新闻，生成一份AI日报。

新闻列表：
${articles.map((a, i) => `${i + 1}. [${a.category}] ${a.title} - ${a.summary}`).join("\n")}

要求：
1. 选出最重要的10条
2. 每条包含：排名、标题、一句话点评
3. 开头写一段今日总览（50字以内）
4. 输出Markdown格式
`;

export const WEEKLY_PROMPT = (articles: { title: string; summary: string; category: string }[]) => `
请基于以下本周AI新闻，生成一份AI周报。

新闻列表：
${articles.map((a, i) => `${i + 1}. [${a.category}] ${a.title} - ${a.summary}`).join("\n")}

要求：
1. 按分类聚合（Models、Agents、MCP、Open Source、Funding、Research）
2. 每个分类列出重点事件
3. 写一段本周趋势总结
4. 写一段下周展望
5. 输出Markdown格式
`;
