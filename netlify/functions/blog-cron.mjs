// Runs on a schedule (twice a day) and wakes up the blog writer. The writing itself happens in blog-writer-background.mjs,
// because writing a full article takes longer than a scheduled function is allowed to run.
// Times are UTC: 07:00 and 16:00 = 8:00 and 17:00 in Lagos.
import crypto from "node:crypto";

export const secretFor = env => crypto.createHash("sha256").update("blog-writer:" + (env.FIREBASE_SERVICE_ACCOUNT || "")).digest("hex");

export default async () => {
  const env = process.env, origin = (env.URL || env.DEPLOY_PRIME_URL || "").replace(/\/$/, "");
  if (!env.FIREBASE_SERVICE_ACCOUNT || !origin) { console.warn("blog-cron: FIREBASE_SERVICE_ACCOUNT or site URL missing, nothing to do."); return; }
  const slot = new Date().getUTCHours() < 12 ? 0 : 1;
  try {
    const r = await fetch(`${origin}/.netlify/functions/blog-writer-background?source=cron&slot=${slot}`, { method: "POST", headers: { "x-blog-secret": secretFor(env) } });
    console.log("blog-cron: started writer, status", r.status);
  } catch (err) { console.error("blog-cron failed:", err.message); }
};

export const config = { schedule: "0 7,16 * * *" };
