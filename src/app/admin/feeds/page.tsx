"use client";

import { useEffect, useState } from "react";

interface Feed {
  id: string;
  name: string;
  url: string;
  category: string | null;
  isActive: boolean;
  lastFetched: string | null;
  _count: { articles: number };
}

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  async function loadFeeds() {
    const res = await fetch("/api/feeds");
    setFeeds(await res.json());
  }

  useEffect(() => { loadFeeds(); }, []);

  async function addFeed(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, category: category || null }),
    });
    if (res.status === 409) {
      setError("该 URL 已存在");
      return;
    }
    if (!res.ok) {
      setError("添加失败");
      return;
    }
    setName("");
    setUrl("");
    setCategory("");
    loadFeeds();
  }

  async function toggleFeed(id: string, isActive: boolean) {
    await fetch(`/api/feeds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    loadFeeds();
  }

  async function deleteFeed(id: string) {
    if (!confirm("确定删除该 Feed？关联文章也会被删除。")) return;
    await fetch(`/api/feeds/${id}`, { method: "DELETE" });
    loadFeeds();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed 管理</h1>

      <form onSubmit={addFeed} className="bg-white rounded-lg border p-4 mb-6">
        <h2 className="font-semibold mb-3">新增 Feed</h2>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名称"
            className="rounded-md border px-3 py-2 text-sm"
            required
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="RSS URL"
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
            required
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="分类（可选）"
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          添加
        </button>
      </form>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">名称</th>
              <th className="text-left px-4 py-3">URL</th>
              <th className="text-left px-4 py-3">文章数</th>
              <th className="text-left px-4 py-3">状态</th>
              <th className="text-left px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed) => (
              <tr key={feed.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{feed.name}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{feed.url}</td>
                <td className="px-4 py-3">{feed._count.articles}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${feed.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {feed.isActive ? "启用" : "禁用"}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => toggleFeed(feed.id, feed.isActive)} className="text-blue-600 hover:underline">
                    {feed.isActive ? "禁用" : "启用"}
                  </button>
                  <button onClick={() => deleteFeed(feed.id)} className="text-red-600 hover:underline">
                    删除
                  </button>
                </td>
              </tr>
            ))}
            {feeds.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无 Feed</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
