import { prisma } from "@/lib/db";
import { ArticleCard } from "@/components/article/article-card";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} - 分类资讯` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const articles = await prisma.article.findMany({
    where: { aiCategory: slug },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { feed: { select: { name: true } }, tags: { include: { tag: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{slug}</h1>
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
        {articles.length === 0 && (
          <p className="text-gray-500 text-center py-12">该分类下暂无文章。</p>
        )}
      </div>
    </div>
  );
}
