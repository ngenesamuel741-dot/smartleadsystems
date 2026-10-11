// Runs after `vite build` (on Netlify, on every deploy). It writes REAL files into dist/:
//   sitemap.xml, rss.xml, llms.txt, and a ready-to-read HTML copy of every page and blog post.
// So the sitemap and all pages exist even if the Netlify function is unavailable. It never fails the build.
import fs from "node:fs";
import path from "node:path";
import { SEED } from "../src/content/seed.js";
import { mergeData } from "../src/lib/data.js";
import { resolveRoute, STATIC_ROUTES } from "../src/lib/seo.js";
import { renderHtml } from "../src/lib/page.js";
import { buildSitemap, buildRss, buildLlms } from "../src/lib/feeds.js";
import { loadRaw } from "../src/lib/firestoreRest.js";

const dist = path.resolve(process.argv[2] || "dist");
const write = (rel, data) => { const f = path.join(dist, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };

try {
  const indexPath = path.join(dist, "index.html"), shellPath = path.join(dist, "app-shell.html");
  const template = fs.existsSync(shellPath) ? fs.readFileSync(shellPath, "utf8") : fs.readFileSync(indexPath, "utf8");
  if (!template.includes("<!--SEO_BODY-->")) throw new Error("index.html has no SEO markers");
  const raw = await loadRaw(), d = mergeData(SEED, raw);
  console.log(`prerender: content from ${raw.posts ? "Firestore" : "built-in defaults (Firestore not reachable)"}; ${d.posts.length} post(s)`);

  write("app-shell.html", template); // clean copy used by /admin and by the function
  const routes = [...STATIC_ROUTES, "/thank-you", "/thank-you-info", ...d.posts.map(p => "/blog/" + p.slug)];
  const redirects = ["/admin /app-shell.html 200", "/admin/* /app-shell.html 200"];
  let count = 0;
  for (const r of routes) {
    const route = resolveRoute(r, d); if (route.status !== 200) continue;
    const html = renderHtml(template, raw, d, route);
    if (r === "/") write("index.html", html); else { write("_pre" + r + ".html", html); redirects.push(`${r} /_pre${r}.html 200`); }
    count++;
  }
  write("404.html", renderHtml(template, raw, d, resolveRoute("/__not-found__", d)));
  write("sitemap.xml", buildSitemap(d)); write("rss.xml", buildRss(d)); write("llms.txt", buildLlms(d));
  write("_redirects", redirects.join("\n") + "\n");
  console.log(`prerender: wrote ${count} pages + sitemap.xml, rss.xml, llms.txt`);
} catch (err) {
  console.warn("prerender skipped (site still works through the Netlify function):", err.message);
}
