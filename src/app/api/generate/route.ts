import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateWechat, generateXiaohongshu } from "@/lib/ai/generators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { articleId, contentType } = body;

  if (!articleId || !contentType) {
    return NextResponse.json({ error: "articleId and contentType are required" }, { status: 400 });
  }

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  try {
    let title: string;
    let content: string;

    if (contentType === "WECHAT") {
      const result = await generateWechat(article.title, article.summary || "", article.content);
      title = result.title;
      content = result.content;
    } else if (contentType === "XIAOHONGSHU") {
      const result = await generateXiaohongshu(article.title, article.summary || "");
      title = result.title;
      content = result.content + "\n\n" + result.tags.join(" ");
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    const generated = await prisma.generatedContent.create({
      data: { articleId, contentType, title, content },
    });

    return NextResponse.json(generated);
  } catch (error) {
    console.error("Content generation failed:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
