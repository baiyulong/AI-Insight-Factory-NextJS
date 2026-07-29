import { prisma } from "@/lib/db";
import { generateDaily } from "@/lib/ai/generators";

export async function runDailyDigest() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.digest.findUnique({ where: { date: today } });
  if (existing) return { skipped: true };

  const articles = await prisma.article.findMany({
    where: {
      publishedAt: { gte: today },
      processedAt: { not: null },
    },
    orderBy: [{ importance: "asc" }, { publishedAt: "desc" }],
    take: 10,
  });

  if (articles.length === 0) {
    const content = "# AI 日报\n\n今日暂无重大 AI 新闻更新。";
    await prisma.digest.create({
      data: { type: "DAILY", title: `AI日报 ${today.toISOString().slice(0, 10)}`, content, date: today },
    });
    return { generated: true, articles: 0 };
  }

  const content = await generateDaily(
    articles.map((a) => ({
      title: a.title,
      summary: a.summary || a.title,
      category: a.aiCategory || "other",
    }))
  );

  await prisma.digest.create({
    data: {
      type: "DAILY",
      title: `AI日报 ${today.toISOString().slice(0, 10)}`,
      content,
      date: today,
    },
  });

  return { generated: true, articles: articles.length };
}
