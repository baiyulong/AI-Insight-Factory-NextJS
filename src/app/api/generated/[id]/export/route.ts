import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;

  const item = await prisma.generatedContent.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filename = `${item.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-").slice(0, 50)}.md`;
  const markdown = `# ${item.title}\n\n${item.content}\n`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
