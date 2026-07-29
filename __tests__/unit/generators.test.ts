import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/provider", () => ({
  aiGenerate: vi.fn(),
  aiGenerateJSON: vi.fn(),
}));

vi.mock("@/lib/ai/prompt-loader", () => ({
  getSummarySystem: vi.fn().mockResolvedValue("system"),
  getSummaryPrompt: vi.fn().mockResolvedValue("prompt"),
  getClassifyPrompt: vi.fn().mockResolvedValue("prompt"),
  getWechatSystem: vi.fn().mockResolvedValue("system"),
  getWechatPrompt: vi.fn().mockResolvedValue("prompt"),
  getXiaohongshuSystem: vi.fn().mockResolvedValue("system"),
  getXiaohongshuPrompt: vi.fn().mockResolvedValue("prompt"),
  getDailyPrompt: vi.fn().mockResolvedValue("prompt"),
  getWeeklyPrompt: vi.fn().mockResolvedValue("prompt"),
}));

import { generateSummary, classifyArticle, generateWechat, generateXiaohongshu } from "@/lib/ai/generators";
import { aiGenerateJSON } from "@/lib/ai/provider";

const mockAiGenerateJSON = vi.mocked(aiGenerateJSON);

describe("AI Generators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateSummary", () => {
    it("returns structured summary from AI", async () => {
      const expected = {
        summary: "OpenAI发布GPT-5",
        keyChange: "多模态能力大幅提升",
        impact: "将改变AI应用格局",
        suggestion: "关注API更新",
      };
      mockAiGenerateJSON.mockResolvedValue(expected);

      const result = await generateSummary("GPT-5 Released", "content here");
      expect(result).toEqual(expected);
      expect(mockAiGenerateJSON).toHaveBeenCalledWith("prompt", "system");
    });

    it("handles null content", async () => {
      mockAiGenerateJSON.mockResolvedValue({
        summary: "test",
        keyChange: "test",
        impact: "test",
        suggestion: "test",
      });

      await generateSummary("Title Only", null);
      expect(mockAiGenerateJSON).toHaveBeenCalled();
    });
  });

  describe("classifyArticle", () => {
    it("returns category, tags, and importance", async () => {
      const expected = {
        category: "models",
        tags: ["GPT", "OpenAI"],
        importance: "HIGH" as const,
      };
      mockAiGenerateJSON.mockResolvedValue(expected);

      const result = await classifyArticle("GPT-5 Released", "Major release");
      expect(result).toEqual(expected);
    });
  });

  describe("generateWechat", () => {
    it("returns title and content", async () => {
      const expected = { title: "重磅！GPT-5来了", content: "正文内容..." };
      mockAiGenerateJSON.mockResolvedValue(expected);

      const result = await generateWechat("GPT-5", "摘要", "内容");
      expect(result).toEqual(expected);
    });
  });

  describe("generateXiaohongshu", () => {
    it("returns title, content, and tags", async () => {
      const expected = {
        title: "🔥 GPT-5来啦！",
        content: "今天给大家聊聊...",
        tags: ["#AI", "#GPT5"],
      };
      mockAiGenerateJSON.mockResolvedValue(expected);

      const result = await generateXiaohongshu("GPT-5", "摘要");
      expect(result).toEqual(expected);
    });
  });
});
