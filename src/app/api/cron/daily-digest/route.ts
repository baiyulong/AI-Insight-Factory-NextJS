import { NextRequest, NextResponse } from "next/server";
import { runDailyDigest } from "@/jobs/daily-digest";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyDigest();
  return NextResponse.json(result);
}
