import { prisma } from "@/lib/db";
import { generateSummary, classifyArticle } from "@/lib/ai/generators";

export async function runAiProcess(batchSize = 10) {
  const articles = await prisma.article.findMany({
    where: { processedAt: null },
    orderBy: { createdAt: "asc" },
    take: batchSize,
  });

  let processed = 0;

  for (const article of articles) {
    try {
      const [summaryResult, classifyResult] = await Promise.all([
        generateSummary(article.title, article.content),
        classifyArticle(article.title, article.content),
      ]);

      const summary = `${summaryResult.summary}\n\n核心变化：${summaryResult.keyChange}\n影响分析：${summaryResult.impact}\n行动建议：${summaryResult.suggestion}`;

      const existingTags = await prisma.tag.findMany({
        where: { name: { in: classifyResult.tags } },
      });
      const existingNames = new Set(existingTags.map((t) => t.name));
      const newTags = classifyResult.tags.filter((t) => !existingNames.has(t));

      const createdTags = await Promise.all(
        newTags.map((name) =>
          prisma.tag.create({
            data: {
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-"),
            },
          })
        )
      );

      const allTags = [...existingTags, ...createdTags];

      await prisma.article.update({
        where: { id: article.id },
        data: {
          summary,
          aiCategory: classifyResult.category,
          importance: classifyResult.importance,
          processedAt: new Date(),
          tags: {
            create: allTags.map((tag) => ({ tagId: tag.id })),
          },
        },
      });

      processed++;
    } catch (error) {
      console.error(`AI processing failed for article ${article.id}:`, error);
    }
  }

  return { processed, pending: articles.length - processed };
}
