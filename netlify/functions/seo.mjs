// Serves SEO-ready HTML for pages that were added after the last build (for example a blog post you just published),
// and /sitemap.xml, /rss.xml, /llms.txt if the build did not create them. Pages that already exist are served as static files.
import { SEED } from "../../src/content/seed.js";
import { mergeData } from "../../src/lib/data.js";
import { resolveRoute, normPath } from "../../src/lib/seo.js";
import { renderHtml } from "../../src/lib/page.js";
import { buildSitemap, buildRss, buildLlms } from "../../src/lib/feeds.js";
import { loadRaw } from "../../src/lib/firestoreRest.js";

const cdn = "public, s-maxage=300, stale-while-revalidate=3600";
const txt = (body, type) => new Response(body, { status: 200, headers: { "content-type": type + "; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate", "netlify-cdn-cache-control": "public, s-maxage=600, stale-while-revalidate=86400" } });

export async function handle(req, fetchBase) {
  const url = new URL(req.url);
  let type = url.searchParams.get("type") || "page", path = url.searchParams.get("path");
  if (path == null) path = url.pathname.startsWith("/.netlify") ? "/" : url.pathname;
  const raw = await loadRaw(), d = mergeData(SEED, raw);

  if (type === "sitemap") return txt(buildSitemap(d), "application/xml");
  if (type === "rss") return txt(buildRss(d), "application/rss+xml");
  if (type === "llms") return txt(buildLlms(d), "text/plain");

  const r = resolveRoute(normPath(path), d);
  const base = await fetchBase(url.origin);
  if (!base) return new Response("Site is updating, please refresh.", { status: 503 });
  return new Response(renderHtml(base, raw, d, r), { status: r.status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate", "netlify-cdn-cache-control": cdn } });
}

async function shell(origin) {
  for (const p of ["/app-shell.html", "/index.html"]) { try { const r = await fetch(origin + p); if (r.ok) { const t = await r.text(); if (t.includes("<!--SEO_BODY-->")) return t; } } catch (e) { /* try next */ } }
  return null;
}

export default async (req) => {
  try { return await handle(req, shell); }
  catch (err) {
    console.error("seo function error", err);
    const t = await shell(new URL(req.url).origin).catch(() => null);
    return t ? new Response(t, { headers: { "content-type": "text/html; charset=utf-8" } }) : new Response("Temporary error. Please refresh.", { status: 500 });
  }
};
