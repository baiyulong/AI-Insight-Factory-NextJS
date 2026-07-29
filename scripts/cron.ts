import cron from "node-cron";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "";

async function trigger(path: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/cron/${path}`, {
      headers: { Authorization: `Bearer ${CRON_SECRET}` },
    });
    const data = await res.json();
    console.log(`[${path}]`, data);
  } catch (error) {
    console.error(`[${path}] failed:`, error);
  }
}

cron.schedule("*/30 * * * *", () => trigger("feed-import"));
cron.schedule("0 * * * *", () => trigger("ai-process"));
cron.schedule("0 7 * * *", () => trigger("daily-digest"));
cron.schedule("0 8 * * 0", () => trigger("weekly-report"));

console.log("Cron scheduler started:");
console.log("  */30 * * * *  → feed-import");
console.log("  0 * * * *     → ai-process");
console.log("  0 7 * * *     → daily-digest");
console.log("  0 8 * * 0     → weekly-report");
