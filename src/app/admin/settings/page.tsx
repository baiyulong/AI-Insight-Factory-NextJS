"use client";

import { useEffect, useState } from "react";

interface Settings {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const PROMPT_FIELDS = [
  { key: "prompt_summary_system", label: "摘要 System Prompt" },
  { key: "prompt_summary", label: "摘要 Prompt（变量: {title}, {content}）" },
  { key: "prompt_classify", label: "分类 Prompt（变量: {title}, {content}）" },
  { key: "prompt_wechat_system", label: "公众号 System Prompt" },
  { key: "prompt_wechat", label: "公众号 Prompt（变量: {title}, {summary}, {content}）" },
  { key: "prompt_xiaohongshu_system", label: "小红书 System Prompt" },
  { key: "prompt_xiaohongshu", label: "小红书 Prompt（变量: {title}, {summary}）" },
  { key: "prompt_daily", label: "日报 Prompt（变量: {articles}）" },
  { key: "prompt_weekly", label: "周报 Prompt（变量: {articles}）" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
  });
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "prompts">("ai");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.apiKey) setSettings({ apiKey: d.apiKey || "", baseUrl: d.baseUrl || "", model: d.model || "" });
        const p: Record<string, string> = {};
        for (const f of PROMPT_FIELDS) {
          if (d[f.key]) p[f.key] = d[f.key];
        }
        setPrompts(p);
      })
      .catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, ...prompts }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">系统配置</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2 text-sm rounded-md ${activeTab === "ai" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}
        >
          AI 服务
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-4 py-2 text-sm rounded-md ${activeTab === "prompts" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}
        >
          Prompt 管理
        </button>
      </div>

      <form onSubmit={save}>
        {activeTab === "ai" && (
          <div className="bg-white rounded-lg border p-6 max-w-lg">
            <h2 className="font-semibold mb-4">AI 服务配置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                <input
                  value={settings.baseUrl}
                  onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模型</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="deepseek-chat">Deepseek Chat</option>
                  <option value="deepseek-reasoner">Deepseek Reasoner</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="claude-sonnet-4-20250514">Claude Sonnet</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "prompts" && (
          <div className="space-y-4 max-w-3xl">
            <p className="text-sm text-gray-500">
              留空则使用内置默认 Prompt。支持变量替换：{"{title}"}, {"{content}"}, {"{summary}"}, {"{articles}"}
            </p>
            {PROMPT_FIELDS.map((field) => (
              <div key={field.key} className="bg-white rounded-lg border p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <textarea
                  value={prompts[field.key] || ""}
                  onChange={(e) => setPrompts({ ...prompts, [field.key]: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border px-3 py-2 text-sm font-mono"
                  placeholder="使用默认 Prompt（留空）"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            保存配置
          </button>
          {saved && <span className="ml-3 text-sm text-green-600">已保存</span>}
        </div>
      </form>
    </div>
  );
}
