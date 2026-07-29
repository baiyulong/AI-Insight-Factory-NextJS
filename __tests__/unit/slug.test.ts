import { describe, it, expect } from "vitest";
import { generateSlug } from "@/lib/feed/parser";

describe("generateSlug", () => {
  it("generates lowercase slug from English title", () => {
    expect(generateSlug("OpenAI Launches GPT-5!")).toBe("openai-launches-gpt-5");
  });

  it("removes special characters", () => {
    expect(generateSlug("What's New in AI? (2026 Edition)")).toBe("whats-new-in-ai-2026-edition");
  });

  it("handles multiple spaces and dashes", () => {
    expect(generateSlug("AI   Agents -- The   Future")).toBe("ai-agents-the-future");
  });

  it("trims leading/trailing dashes", () => {
    expect(generateSlug("---Hello World---")).toBe("hello-world");
  });

  it("returns fallback for empty result", () => {
    const slug = generateSlug("!!!");
    expect(slug).toMatch(/^article-/);
  });

  it("handles Chinese characters by removing them", () => {
    const slug = generateSlug("OpenAI发布GPT-5新模型");
    expect(slug).toContain("openai");
    expect(slug).toContain("gpt-5");
  });
});
