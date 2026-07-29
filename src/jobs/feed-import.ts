import { prisma } from "@/lib/db";
import { parseFeed, generateSlug } from "@/lib/feed/parser";
import { isDuplicate } from "@/lib/feed/dedup";

export async function runFeedImport() {
  const feeds = await prisma.feed.findMany({ where: { isActive: true } });
  let imported = 0;
  let skipped = 0;

  for (const feed of feeds) {
    try {
      const articles = await parseFeed(feed.url);

      for (const article of articles) {
        if (await isDuplicate(article.link, article.title)) {
          skipped++;
          continue;
        }

        let slug = generateSlug(article.title);
        const existingSlug = await prisma.article.findUnique({ where: { slug } });
        if (existingSlug) {
          slug = `${slug}-${Date.now().toString(36)}`;
        }

        await prisma.article.create({
          data: {
            feedId: feed.id,
            title: article.title,
            slug,
            link: article.link,
            content: article.content,
            publishedAt: article.publishedAt,
          },
        });
        imported++;
      }

      await prisma.feed.update({
        where: { id: feed.id },
        data: { lastFetched: new Date() },
      });
    } catch (error) {
      console.error(`Failed to fetch feed ${feed.name} (${feed.url}):`, error);
    }
  }

  return { imported, skipped, feedsProcessed: feeds.length };
}
