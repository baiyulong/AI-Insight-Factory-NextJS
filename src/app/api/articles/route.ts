import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");
  const importance = searchParams.get("importance");
  const offset = (page - 1) * limit;

  if (q) {
    const tsQuery = q.trim().split(/\s+/).join(" | ");

    const articles = await prisma.$queryRaw`
      SELECT a.id, a.title, a.slug, a.summary, a."aiCategory", a.importance, a."publishedAt",
             f.name as "feedName",
             ts_rank(a.search_vector, to_tsquery('simple', ${tsQuery})) as rank
      FROM "Article" a
      JOIN "Feed" f ON f.id = a."feedId"
      WHERE a.search_vector @@ to_tsquery('simple', ${tsQuery})
      ORDER BY rank DESC, a."publishedAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await prisma.$queryRaw`
      SELECT COUNT(*)::int as total FROM "Article"
      WHERE search_vector @@ to_tsquery('simple', ${tsQuery})
    `;
    const total = (countResult as { total: number }[])[0]?.total || 0;

    return NextResponse.json({
      articles: (articles as Record<string, unknown>[]).map((a) => ({
        ...a,
        feed: { name: a.feedName },
        tags: [],
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }

  const where: Prisma.ArticleWhereInput = {};
  if (category) where.aiCategory = category;
  if (importance) where.importance = importance as Prisma.EnumImportanceFilter["equals"];
  if (tag) where.tags = { some: { tag: { slug: tag } } };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        feed: { select: { name: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
