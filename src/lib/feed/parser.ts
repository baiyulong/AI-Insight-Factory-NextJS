import Parser from "rss-parser";
import slugify from "slugify";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "AI-Insight-Factory/1.0" },
});

export interface ParsedArticle {
  title: string;
  link: string;
  content: string | null;
  publishedAt: Date;
}

export async function parseFeed(url: string): Promise<ParsedArticle[]> {
  const feed = await parser.parseURL(url);
  return (feed.items || [])
    .filter((item) => item.title && item.link)
    .map((item) => ({
      title: item.title!.trim(),
      link: item.link!.trim(),
      content: item.contentSnippet || item.content || null,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    }));
}

export function generateSlug(title: string): string {
  const slug = slugify(title, { lower: true, strict: true, trim: true });
  return slug || `article-${Date.now()}`;
}
