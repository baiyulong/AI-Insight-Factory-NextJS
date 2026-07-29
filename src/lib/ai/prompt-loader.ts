import { prisma } from "@/lib/db";
import {
  SUMMARY_SYSTEM as DEFAULT_SUMMARY_SYSTEM,
  SUMMARY_PROMPT as DEFAULT_SUMMARY_PROMPT,
  CLASSIFY_PROMPT as DEFAULT_CLASSIFY_PROMPT,
  WECHAT_SYSTEM as DEFAULT_WECHAT_SYSTEM,
  WECHAT_PROMPT as DEFAULT_WECHAT_PROMPT,
  XIAOHONGSHU_SYSTEM as DEFAULT_XIAOHONGSHU_SYSTEM,
  XIAOHONGSHU_PROMPT as DEFAULT_XIAOHONGSHU_PROMPT,
  DAILY_PROMPT as DEFAULT_DAILY_PROMPT,
  WEEKLY_PROMPT as DEFAULT_WEEKLY_PROMPT,
} from "./prompts";

let promptCache: Record<string, string> | null = null;
let promptCacheTime = 0;
const CACHE_TTL = 60_000;

async function getPromptOverrides(): Promise<Record<string, string>> {
  const now = Date.now();
  if (promptCache && now - promptCacheTime < CACHE_TTL) return promptCache;

  const settings = await prisma.setting.findMany({
    where: { key: { startsWith: "prompt_" } },
  });

  promptCache = {};
  for (const s of settings) {
    promptCache[s.key] = s.value;
  }
  promptCacheTime = now;
  return promptCache;
}

export async function getSummarySystem(): Promise<string> {
  const overrides = await getPromptOverrides();
  return overrides["prompt_summary_system"] || DEFAULT_SUMMARY_SYSTEM;
}

export async function getSummaryPrompt(title: string, content: string): Promise<string> {
  const overrides = await getPromptOverrides();
  const template = overrides["prompt_summary"];
  if (template) {
    return template.replace("{title}", title).replace("{content}", content || title);
  }
  return DEFAULT_SUMMARY_PROMPT(title, content);
}

export async function getClassifyPrompt(title: string, content: string): Promise<string> {
  const overrides = await getPromptOverrides();
  const template = overrides["prompt_classify"];
  if (template) {
    return template.replace("{title}", title).replace("{content}", content || title);
  }
  return DEFAULT_CLASSIFY_PROMPT(title, content);
}

export async function getWechatSystem(): Promise<string> {
  const overrides = await getPromptOverrides();
  return overrides["prompt_wechat_system"] || DEFAULT_WECHAT_SYSTEM;
}

export async function getWechatPrompt(title: string, summary: string, content: string): Promise<string> {
  const overrides = await getPromptOverrides();
  const template = overrides["prompt_wechat"];
  if (template) {
    return template
      .replace("{title}", title)
      .replace("{summary}", summary)
      .replace("{content}", content || summary);
  }
  return DEFAULT_WECHAT_PROMPT(title, summary, content);
}

export async function getXiaohongshuSystem(): Promise<string> {
  const overrides = await getPromptOverrides();
  return overrides["prompt_xiaohongshu_system"] || DEFAULT_XIAOHONGSHU_SYSTEM;
}

export async function getXiaohongshuPrompt(title: string, summary: string): Promise<string> {
  const overrides = await getPromptOverrides();
  const template = overrides["prompt_xiaohongshu"];
  if (template) {
    return template.replace("{title}", title).replace("{summary}", summary);
  }
  return DEFAULT_XIAOHONGSHU_PROMPT(title, summary);
}

export async function getDailyPrompt(articles: { title: string; summary: string; category: string }[]): Promise<string> {
  const overrides = await getPromptOverrides();
  const template = overrides["prompt_daily"];
  if (template) {
    const list = articles.map((a, i) => `${i + 1}. [${a.category}] ${a.title} - ${a.summary}`).join("\n");
    return template.replace("{articles}", list);
  }
  return DEFAULT_DAILY_PROMPT(articles);
}

export async function getWeeklyPrompt(articles: { title: string; summary: string; category: string }[]): Promise<string> {
  const overrides = await getPromptOverrides();
  const template = overrides["prompt_weekly"];
  if (template) {
    const list = articles.map((a, i) => `${i + 1}. [${a.category}] ${a.title} - ${a.summary}`).join("\n");
    return template.replace("{articles}", list);
  }
  return DEFAULT_WEEKLY_PROMPT(articles);
}
