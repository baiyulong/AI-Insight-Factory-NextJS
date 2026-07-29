import { aiGenerate, aiGenerateJSON } from "./provider";
import {
  getSummarySystem,
  getSummaryPrompt,
  getClassifyPrompt,
  getWechatSystem,
  getWechatPrompt,
  getXiaohongshuSystem,
  getXiaohongshuPrompt,
  getDailyPrompt,
  getWeeklyPrompt,
} from "./prompt-loader";

interface SummaryResult {
  summary: string;
  keyChange: string;
  impact: string;
  suggestion: string;
}

interface ClassifyResult {
  category: string;
  tags: string[];
  importance: "HIGH" | "MEDIUM" | "LOW";
}

interface WechatResult {
  title: string;
  content: string;
}

interface XiaohongshuResult {
  title: string;
  content: string;
  tags: string[];
}

export async function generateSummary(title: string, content: string | null): Promise<SummaryResult> {
  const [system, prompt] = await Promise.all([
    getSummarySystem(),
    getSummaryPrompt(title, content || ""),
  ]);
  return aiGenerateJSON<SummaryResult>(prompt, system);
}

export async function classifyArticle(title: string, content: string | null): Promise<ClassifyResult> {
  const prompt = await getClassifyPrompt(title, content || "");
  return aiGenerateJSON<ClassifyResult>(prompt);
}

export async function generateWechat(title: string, summary: string, content: string | null): Promise<WechatResult> {
  const [system, prompt] = await Promise.all([
    getWechatSystem(),
    getWechatPrompt(title, summary, content || ""),
  ]);
  return aiGenerateJSON<WechatResult>(prompt, system);
}

export async function generateXiaohongshu(title: string, summary: string): Promise<XiaohongshuResult> {
  const [system, prompt] = await Promise.all([
    getXiaohongshuSystem(),
    getXiaohongshuPrompt(title, summary),
  ]);
  return aiGenerateJSON<XiaohongshuResult>(prompt, system);
}

export async function generateDaily(articles: { title: string; summary: string; category: string }[]): Promise<string> {
  const prompt = await getDailyPrompt(articles);
  return aiGenerate(prompt);
}

export async function generateWeekly(articles: { title: string; summary: string; category: string }[]): Promise<string> {
  const prompt = await getWeeklyPrompt(articles);
  return aiGenerate(prompt);
}
