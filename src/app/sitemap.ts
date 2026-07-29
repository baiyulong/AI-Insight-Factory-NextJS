import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const articles = await prisma.article.findMany({
    select: { slug: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 500,
  });

  const categories = ["models", "agents", "mcp", "opensource", "funding", "research"];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/daily`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/weekly`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${baseUrl}/category/${c}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${baseUrl}/article/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
