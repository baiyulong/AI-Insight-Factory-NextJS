import { prisma } from "@/lib/db";
import { generateWeekly } from "@/lib/ai/generators";

export async function runWeeklyReport() {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const mondayOfWeek = new Date(weekStart);
  mondayOfWeek.setDate(weekStart.getDate() - weekStart.getDay() + 1);

  const existing = await prisma.digest.findFirst({
    where: { type: "WEEKLY", date: { gte: mondayOfWeek } },
  });
  if (existing) return { skipped: true };

  const articles = await prisma.article.findMany({
    where: {
      publishedAt: { gte: weekStart },
      processedAt: { not: null },
    },
    orderBy: [{ importance: "asc" }, { publishedAt: "desc" }],
    take: 50,
  });

  if (articles.length === 0) {
    const content = "# AI 周报\n\n本周暂无重大 AI 新闻更新。";
    await prisma.digest.create({
      data: { type: "WEEKLY", title: `AI周报 ${weekStart.toISOString().slice(0, 10)}`, content, date: mondayOfWeek },
    });
    return { generated: true, articles: 0 };
  }

  const content = await generateWeekly(
    articles.map((a) => ({
      title: a.title,
      summary: a.summary || a.title,
      category: a.aiCategory || "other",
    }))
  );

  await prisma.digest.create({
    data: {
      type: "WEEKLY",
      title: `AI周报 ${weekStart.toISOString().slice(0, 10)}`,
      content,
      date: mondayOfWeek,
    },
  });

  return { generated: true, articles: articles.length };
}
