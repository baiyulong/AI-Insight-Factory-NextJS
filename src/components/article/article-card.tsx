import Link from "next/link";
import { format } from "date-fns";

interface ArticleCardProps {
  title: string;
  slug: string;
  summary?: string | null;
  source?: string;
  category?: string | null;
  importance?: string;
  publishedAt: Date;
  tags?: { tag: { name: string; slug: string } }[];
}

const importanceColors: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-gray-100 text-gray-600",
};

export function ArticleCard({
  title,
  slug,
  summary,
  source,
  category,
  importance,
  publishedAt,
  tags,
}: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        {importance && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${importanceColors[importance] || importanceColors.LOW}`}>
            {importance}
          </span>
        )}
        {category && (
          <Link href={`/category/${category}`} className="text-xs text-blue-600 hover:underline">
            {category}
          </Link>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          {format(new Date(publishedAt), "MM-dd HH:mm")}
        </span>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        <Link href={`/article/${slug}`} className="hover:text-blue-600 transition-colors">
          {title}
        </Link>
      </h2>
      {summary && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{summary.split("\n")[0]}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {source && <span className="text-xs text-gray-400">来源: {source}</span>}
        {tags?.slice(0, 3).map(({ tag }) => (
          <span key={tag.slug} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {tag.name}
          </span>
        ))}
      </div>
    </article>
  );
}
