import { prisma } from "@/lib/db";
import { ArticleCard } from "@/components/article/article-card";

interface Props {
  searchParams: Promise<{ q?: string; tag?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, tag } = await searchParams;

  let articles: Awaited<ReturnType<typeof prisma.article.findMany<{ include: { feed: { select: { name: true } }; tags: { include: { tag: true } } } }>>> = [];

  if (q || tag) {
    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }
    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: { feed: { select: { name: true } }, tags: { include: { tag: true } } },
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">搜索</h1>

      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="搜索文章标题或摘要..."
            className="flex-1 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
          >
            搜索
          </button>
        </div>
      </form>

      {(q || tag) && (
        <p className="text-sm text-gray-500 mb-4">
          找到 {articles.length} 条结果
          {q && `（关键词: ${q}）`}
          {tag && `（标签: ${tag}）`}
        </p>
      )}

      <div className="grid gap-4">
        {articles.map((article) => (
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
        {(q || tag) && articles.length === 0 && (
          <p className="text-gray-500 text-center py-12">未找到相关文章。</p>
        )}
      </div>
    </div>
  );
}
