import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/category/models", label: "AI Models" },
  { href: "/category/agents", label: "AI Agents" },
  { href: "/category/mcp", label: "MCP" },
  { href: "/category/opensource", label: "开源" },
  { href: "/daily", label: "日报" },
  { href: "/weekly", label: "周报" },
];

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            AI Insight Factory
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/search"
            className="text-sm text-gray-500 hover:text-gray-900 border rounded-md px-3 py-1.5"
          >
            搜索
          </Link>
        </div>
      </div>
    </header>
  );
}
