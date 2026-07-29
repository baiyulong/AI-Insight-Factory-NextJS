import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { prisma } from "@/lib/db";

interface AIConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

let cachedConfig: AIConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

async function getAIConfig(): Promise<AIConfig> {
  const now = Date.now();
  if (cachedConfig && now - cacheTime < CACHE_TTL) return cachedConfig;

  const settings = await prisma.setting.findMany({
    where: { key: { in: ["apiKey", "baseUrl", "model"] } },
  });

  const map = new Map(settings.map((s) => [s.key, s.value]));

  cachedConfig = {
    apiKey: map.get("apiKey") || process.env.DEEPSEEK_API_KEY || "",
    baseURL: map.get("baseUrl") || process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: map.get("model") || process.env.AI_MODEL || "deepseek-chat",
  };
  cacheTime = now;
  return cachedConfig;
}

function createModel(config: AIConfig) {
  const provider = createOpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
  return provider(config.model);
}

export async function aiGenerate(prompt: string, system?: string) {
  const config = await getAIConfig();
  const { text } = await generateText({
    model: createModel(config),
    prompt,
    system,
    temperature: 0.7,
    maxRetries: 3,
  });
  return text;
}

export async function aiGenerateJSON<T>(prompt: string, system?: string): Promise<T> {
  const config = await getAIConfig();
  const { text } = await generateText({
    model: createModel(config),
    prompt,
    system: system || "You must respond with valid JSON only. No markdown, no explanation.",
    temperature: 0.3,
    maxRetries: 3,
  });
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as T;
}
