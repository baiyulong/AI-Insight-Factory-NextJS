import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "管理后台" };

const sidebarItems = [
  { href: "/admin/dashboard", label: "仪表盘" },
  { href: "/admin/feeds", label: "Feed 管理" },
  { href: "/admin/articles", label: "内容管理" },
  { href: "/admin/content-factory", label: "内容工厂" },
  { href: "/admin/settings", label: "系统配置" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-white p-4">
        <Link href="/admin/dashboard" className="text-lg font-bold text-gray-900 block mb-6">
          AIF Admin
        </Link>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← 返回前台</Link>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
