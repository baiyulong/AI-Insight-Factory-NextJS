"use client";

import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  summary: string | null;
}

interface GeneratedItem {
  id: string;
  contentType: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function ContentFactoryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState("");
  const [contentType, setContentType] = useState("WECHAT");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedItem | null>(null);
  const [history, setHistory] = useState<GeneratedItem[]>([]);
  const [editing, setEditing] = useState<GeneratedItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  function loadHistory() {
    fetch("/api/generated?limit=20")
      .then((r) => r.json())
      .then((d) => setHistory(d.items || []))
      .catch(() => {});
  }

  useEffect(() => {
    fetch("/api/articles?limit=50")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles));
    loadHistory();
  }, []);

  async function generate() {
    if (!selected) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: selected, contentType }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        loadHistory();
      }
    } finally {
      setLoading(false);
    }
  }

  async function regenerate(item: GeneratedItem) {
    const article = articles.find((a) => a.id === item.id);
    if (!article) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, contentType: item.contentType }),
      });
      if (res.ok) {
        setResult(await res.json());
        loadHistory();
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/generated/${id}`, { method: "DELETE" });
    loadHistory();
  }

  async function saveEdit() {
    if (!editing) return;
    await fetch(`/api/generated/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    setEditing(null);
    loadHistory();
  }

  function startEdit(item: GeneratedItem) {
    setEditing(item);
    setEditTitle(item.title);
    setEditContent(item.content);
  }

  function exportMarkdown(id: string) {
    window.open(`/api/generated/${id}/export`, "_blank");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">内容工厂</h1>

      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          >
            <option value="">选择文章...</option>
            {articles.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="WECHAT">微信公众号</option>
            <option value="XIAOHONGSHU">小红书笔记</option>
          </select>
        </div>
        <button
          onClick={generate}
          disabled={!selected || loading}
          className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "生成中..." : "生成内容"}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">{result.title}</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">生成成功</span>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">{result.content}</div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => navigator.clipboard.writeText(result.content)} className="text-sm text-blue-600 hover:underline">
              复制
            </button>
            <button onClick={() => exportMarkdown(result.id)} className="text-sm text-blue-600 hover:underline">
              导出 Markdown
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">编辑内容</h2>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm mb-3"
              placeholder="标题"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={16}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={saveEdit} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                保存
              </button>
              <button onClick={() => setEditing(null)} className="rounded-md border px-4 py-2 text-sm text-gray-700">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-semibold mb-3">历史生成</h2>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div className="flex items-center gap-2 truncate max-w-[50%]">
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{item.contentType}</span>
                  <span className="truncate">{item.title}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline">编辑</button>
                  <button onClick={() => exportMarkdown(item.id)} className="text-blue-600 hover:underline">导出</button>
                  <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:underline">删除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
