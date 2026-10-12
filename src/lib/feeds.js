import { escapeHtml as e, stripMd } from "./md.js";
import { STATIC_ROUTES, abs } from "./seo.js";

const day = s => { const t = Date.parse(s); return isNaN(t) ? "" : new Date(t).toISOString().slice(0, 10); };

// Sitemap. changefreq and priority are hints (Google mostly ignores them); an accurate <lastmod> is what helps most.
const PRIORITY = { "/": "1.0", "/blog": "1.0", "/services": "0.9", "/pricing": "0.9", "/work": "0.8", "/contact": "0.8", "/founders": "0.7", "/privacy": "0.3", "/terms": "0.3" };
export function buildSitemap(d) {
  const newest = d.posts.map(p => day(p.updatedAt || p.date)).filter(Boolean).sort().pop() || "";
  const legal = p => p === "/privacy" || p === "/terms";
  const gal = arr => (arr || []).map(u => ({ url: u }));
  const urls = STATIC_ROUTES.filter(p => !legal(p) || d.pages.some(x => "/" + x.id === p)).map(p => ({
    loc: p, lastmod: p === "/" || p === "/blog" ? newest : "", pri: PRIORITY[p] || "0.7", freq: legal(p) ? "monthly" : "daily",
    images: p === "/founders" ? d.founders.flatMap(x => [{ url: x.photo, title: x.name }, ...gal(x.gallery).map(g => ({ ...g, title: x.name }))]) : p === "/services" ? d.services.flatMap(x => [{ url: x.image, title: x.title }, ...gal(x.gallery).map(g => ({ ...g, title: x.title }))]) : []
  }));
  d.posts.forEach(p => urls.push({ loc: "/blog/" + p.slug, lastmod: day(p.updatedAt || p.date), images: [{ url: p.coverImage, title: p.title }, ...gal(p.gallery).map(g => ({ ...g, title: p.title }))], pri: "0.9", freq: "daily" }));
  const body = urls.map(u => `<url><loc>${e(abs(d, u.loc))}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<changefreq>${u.freq}</changefreq><priority>${u.pri}</priority>${(u.images || []).filter(i => /^https?:/i.test(i.url || "")).map(i => `<image:image><image:loc>${e(i.url)}</image:loc>${i.title ? `<image:title>${e(i.title)}</image:title>` : ""}</image:image>`).join("")}</url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
}

export function buildRss(d) {
  const s = d.settings;
  const items = d.posts.slice(0, 30).map(p => `<item><title>${e(p.title)}</title><link>${e(abs(d, "/blog/" + p.slug))}</link><guid isPermaLink="true">${e(abs(d, "/blog/" + p.slug))}</guid><pubDate>${new Date(Date.parse(p.date) || Date.now()).toUTCString()}</pubDate><category>${e(p.category)}</category><description>${e(p.excerpt || stripMd(p.content).slice(0, 280))}</description></item>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${e(s.name)} Insights</title><link>${e(abs(d, "/blog"))}</link><description>${e(s.siteDescription)}</description><language>en</language>${items}</channel></rss>`;
}

// llms.txt: a plain-text guide that helps AI assistants understand and cite the site.
export function buildLlms(d) {
  const s = d.settings, f = d.founders[0];
  const L = [`# ${s.name}`, "", `> ${s.siteDescription}`, "", `${s.name} is based in ${s.location}. Contact: ${s.email} | WhatsApp ${s.whatsapp} | ${s.url}`, ""];
  L.push("## Services"); d.services.forEach(x => L.push(`- [${x.title}](${abs(d, "/services#" + x.id)}): ${x.description}`));
  if (d.industries.length) { L.push("", "## Who we help"); d.industries.forEach(x => L.push(`- ${x.title}: ${x.description}`)); }
  if (d.pricing.length) { L.push("", "## Pricing", `- [Pricing](${abs(d, "/pricing")}): ${d.pricing.map(p => `${p.title} ${p.price} ${p.period}`).join("; ")}. ${s.pricingNote}`); }
  if (f) { L.push("", "## Founder", `- [${f.name}, ${f.role}](${abs(d, "/founders")}): ${stripMd(f.bio).slice(0, 220)}`); }
  L.push("", "## Articles and guides"); d.posts.forEach(p => L.push(`- [${p.title}](${abs(d, "/blog/" + p.slug)}): ${p.excerpt || stripMd(p.content).slice(0, 160)}`));
  if (d.faqs.length) { L.push("", "## FAQ"); d.faqs.forEach(q => L.push(`- ${q.question} ${q.answer}`)); }
  L.push("", "## Optional", `- [Sitemap](${abs(d, "/sitemap.xml")})`, `- [RSS feed](${abs(d, "/rss.xml")})`, `- [Contact](${abs(d, "/contact")})`);
  return L.join("\n") + "\n";
}
