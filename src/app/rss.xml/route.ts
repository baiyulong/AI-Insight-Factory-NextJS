import { prisma } from "@/lib/db";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 50,
    include: { feed: { select: { name: true } } },
  });

  const items = articles
    .map(
      (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${a.link}</link>
      <guid>${a.link}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${a.summary || a.title}]]></description>
      <source>${a.feed.name}</source>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI Insight Factory</title>
    <description>AI 行业动态采集与情报分析</description>
    <link>${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
