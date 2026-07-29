export function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
        <p>AI Insight Factory - AI 行业情报采集与内容生产平台</p>
        <p className="mt-2">
          <a href="/rss.xml" className="hover:text-gray-900">RSS</a>
          {" · "}
          <a href="/admin" className="hover:text-gray-900">管理后台</a>
        </p>
      </div>
    </footer>
  );
}
