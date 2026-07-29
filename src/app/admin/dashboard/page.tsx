import { prisma } from "@/lib/db";

export const revalidate = 0;

export default async function DashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [todayCount, weekCount, totalArticles, generatedCount, topTags] = await Promise.all([
    prisma.article.count({ where: { createdAt: { gte: today } } }),
    prisma.article.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.article.count(),
    prisma.generatedContent.count(),
    prisma.articleTag.groupBy({
      by: ["tagId"],
      _count: true,
      orderBy: { _count: { tagId: "desc" } },
      take: 10,
    }),
  ]);

  const tagIds = topTags.map((t) => t.tagId);
  const tags = await prisma.tag.findMany({ where: { id: { in: tagIds } } });
  const tagMap = new Map(tags.map((t) => [t.id, t.name]));

  const stats = [
    { label: "今日采集", value: todayCount },
    { label: "本周采集", value: weekCount },
    { label: "文章总数", value: totalArticles },
    { label: "AI 生成数", value: generatedCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">热门标签</h2>
        <div className="flex flex-wrap gap-2">
          {topTags.map((t) => (
            <span key={t.tagId} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {tagMap.get(t.tagId) || "unknown"} ({t._count})
            </span>
          ))}
          {topTags.length === 0 && <p className="text-sm text-gray-400">暂无标签数据</p>}
        </div>
      </div>
    </div>
  );
}
