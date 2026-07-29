import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const feeds = [
    { name: "OpenAI Blog", url: "https://openai.com/blog/rss.xml", category: "models" },
    { name: "Anthropic Blog", url: "https://www.anthropic.com/rss.xml", category: "models" },
    { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/", category: "models" },
    { name: "Hacker News AI", url: "https://hnrss.org/newest?q=AI+LLM", category: "research" },
    { name: "GitHub Trending", url: "https://mshibanern.github.io/GitHubTrendingRSS/daily/all.xml", category: "opensource" },
    { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml", category: "opensource" },
    { name: "MIT Tech Review AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", category: "research" },
    { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", category: "models" },
  ];

  for (const feed of feeds) {
    await prisma.feed.upsert({
      where: { url: feed.url },
      update: {},
      create: feed,
    });
  }

  const tags = ["GPT", "Claude", "Gemini", "Agent", "MCP", "Open Source", "Funding", "Research", "Llama", "DeepSeek"];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  console.log("Seed complete: 8 feeds, 10 tags");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
