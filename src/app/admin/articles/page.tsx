"use client";

import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  aiCategory: string | null;
  importance: string;
  processedAt: string | null;
  publishedAt: string;
  feed: { name: string };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function load() {
    const res = await fetch(`/api/articles?page=${page}&limit=20`);
    const data = await res.json();
    setArticles(data.articles);
    setTotal(data.pagination.total);
  }

  useEffect(() => { load(); }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">内容管理</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">标题</th>
              <th className="text-left px-4 py-3">来源</th>
              <th className="text-left px-4 py-3">分类</th>
              <th className="text-left px-4 py-3">重要度</th>
              <th className="text-left px-4 py-3">AI 处理</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="px-4 py-3 max-w-[300px] truncate font-medium">{a.title}</td>
                <td className="px-4 py-3 text-gray-500">{a.feed.name}</td>
                <td className="px-4 py-3">{a.aiCategory || "-"}</td>
                <td className="px-4 py-3">{a.importance}</td>
                <td className="px-4 py-3">
                  {a.processedAt ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">已处理</span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">待处理</span>
                  )}
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无文章</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>共 {total} 篇</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
            上一页
          </button>
          <span className="px-3 py-1">第 {page} 页</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={articles.length < 20} className="px-3 py-1 border rounded disabled:opacity-50">
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}
