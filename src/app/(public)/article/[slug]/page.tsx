import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary?.split("\n")[0] || article.title,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      feed: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) notFound();

  const related = await prisma.article.findMany({
    where: {
      aiCategory: article.aiCategory,
      id: { not: article.id },
    },
    take: 5,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <article>
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <span>{article.feed.name}</span>
          <span>{format(new Date(article.publishedAt), "yyyy-MM-dd HH:mm")}</span>
          {article.aiCategory && (
            <Link href={`/category/${article.aiCategory}`} className="text-blue-600 hover:underline">
              {article.aiCategory}
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

        {article.summary && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-blue-800 mb-2">AI 摘要</h2>
            <p className="text-sm text-blue-900 whitespace-pre-line">{article.summary}</p>
          </div>
        )}

        {article.content && (
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {article.content}
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 flex-wrap">
          {article.tags.map(({ tag }) => (
            <span key={tag.slug} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            阅读原文 →
          </a>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-10 pt-6 border-t">
          <h2 className="text-lg font-semibold mb-4">推荐阅读</h2>
          <div className="space-y-3">
            {related.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`} className="block text-gray-700 hover:text-blue-600">
                {a.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
