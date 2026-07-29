import { NextRequest, NextResponse } from "next/server";
import { runAiProcess } from "@/jobs/ai-process";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runAiProcess();
  return NextResponse.json(result);
}
