import { prisma } from "@/lib/db";
import { ArticleCard } from "@/components/article/article-card";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [hotArticles, latestArticles] = await Promise.all([
    prisma.article.findMany({
      where: { importance: "HIGH", processedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { feed: { select: { name: true } }, tags: { include: { tag: true } } },
    }),
    prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: { feed: { select: { name: true } }, tags: { include: { tag: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {hotArticles.length > 0 && (
        <section className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">热门资讯</h1>
          <div className="grid gap-4">
            {hotArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                summary={article.summary}
                source={article.feed.name}
                category={article.aiCategory}
                importance={article.importance}
                publishedAt={article.publishedAt}
                tags={article.tags}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">最新资讯</h1>
          <div className="flex gap-3 text-sm">
            <Link href="/daily" className="text-blue-600 hover:underline">AI 日报</Link>
            <Link href="/weekly" className="text-blue-600 hover:underline">AI 周报</Link>
          </div>
        </div>
        <div className="grid gap-4">
          {latestArticles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              summary={article.summary}
              source={article.feed.name}
              category={article.aiCategory}
              importance={article.importance}
              publishedAt={article.publishedAt}
              tags={article.tags}
            />
          ))}
          {latestArticles.length === 0 && (
            <p className="text-gray-500 text-center py-12">暂无文章，请先配置 RSS 源并触发采集。</p>
          )}
        </div>
      </section>
    </div>
  );
}
