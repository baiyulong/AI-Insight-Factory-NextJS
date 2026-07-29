import { NextRequest, NextResponse } from "next/server";
import { runWeeklyReport } from "@/jobs/weekly-report";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runWeeklyReport();
  return NextResponse.json(result);
}
