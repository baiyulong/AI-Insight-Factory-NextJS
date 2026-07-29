import { prisma } from "@/lib/db";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI 日报" };
export const revalidate = 300;

export default async function DailyPage() {
  const digests = await prisma.digest.findMany({
    where: { type: "DAILY" },
    orderBy: { date: "desc" },
    take: 30,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI 日报</h1>
      <div className="space-y-8">
        {digests.map((digest) => (
          <article key={digest.id} className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{digest.title}</h2>
            <time className="text-sm text-gray-400">{format(new Date(digest.date), "yyyy-MM-dd")}</time>
            <div className="mt-4 prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {digest.content}
            </div>
          </article>
        ))}
        {digests.length === 0 && (
          <p className="text-gray-500 text-center py-12">暂无日报，系统将每天 07:00 自动生成。</p>
        )}
      </div>
    </div>
  );
}
