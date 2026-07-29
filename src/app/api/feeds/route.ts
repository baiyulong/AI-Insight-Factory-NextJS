import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const feeds = await prisma.feed.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { articles: true } } },
  });
  return NextResponse.json(feeds);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, url, category } = body;

  if (!name || !url) {
    return NextResponse.json({ error: "name and url are required" }, { status: 400 });
  }

  const existing = await prisma.feed.findUnique({ where: { url } });
  if (existing) {
    return NextResponse.json({ error: "Feed URL already exists" }, { status: 409 });
  }

  const feed = await prisma.feed.create({ data: { name, url, category } });
  return NextResponse.json(feed, { status: 201 });
}
