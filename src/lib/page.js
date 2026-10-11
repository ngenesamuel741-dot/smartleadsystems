// Builds the final HTML for a route: SEO tags, structured data, embedded content and a crawler-readable body.
// Used by the build-time prerender script and by the Netlify function (for pages added after the last build).
import { escapeHtml as e } from "./md.js";
import { abs } from "./seo.js";
import { renderStatic } from "./staticHtml.js";

export const safeJson = o => JSON.stringify(o).replace(/</g, "\\u003c").replace(/\u2028|\u2029/g, "");

export function headTags(r, d) {
  const q = r.seo, url = abs(d, q.path === "/" ? "/" : q.path), s = d.settings, t = [];
  t.push(`<title data-rh="true">${e(q.title)}</title>`);
  t.push(`<meta data-rh="true" name="description" content="${e(q.description)}"/>`);
  t.push(`<meta data-rh="true" name="robots" content="${q.noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1"}"/>`);
  if (!q.noindex) t.push(`<link data-rh="true" rel="canonical" href="${e(url)}"/>`);
  t.push(`<meta data-rh="true" property="og:site_name" content="${e(s.name)}"/>`, `<meta data-rh="true" property="og:type" content="${q.type}"/>`, `<meta data-rh="true" property="og:title" content="${e(q.title)}"/>`, `<meta data-rh="true" property="og:description" content="${e(q.description)}"/>`, `<meta data-rh="true" property="og:url" content="${e(url)}"/>`);
  if (q.image) t.push(`<meta data-rh="true" property="og:image" content="${e(q.image)}"/>`, `<meta data-rh="true" name="twitter:image" content="${e(q.image)}"/>`);
  t.push(`<meta data-rh="true" name="twitter:card" content="summary_large_image"/>`, `<meta data-rh="true" name="twitter:title" content="${e(q.title)}"/>`, `<meta data-rh="true" name="twitter:description" content="${e(q.description)}"/>`);
  if (q.published) t.push(`<meta data-rh="true" property="article:published_time" content="${e(q.published)}"/>`);
  if (q.modified) t.push(`<meta data-rh="true" property="article:modified_time" content="${e(q.modified)}"/>`);
  if (r.jsonld) t.push(`<script type="application/ld+json">${safeJson(r.jsonld)}</script>`);
  return t.join("");
}

// Content embedded for the browser so the page paints instantly. Drafts are never embedded.
export function preload(raw, r) {
  const slim = { ...raw };
  if (slim.posts) slim.posts = slim.posts.filter(p => p.published !== false).map(p => (r.post && p.id === r.post.id) ? p : { ...p, content: undefined });
  return `<script>window.__SL__=${safeJson(slim)}</script>`;
}

export const renderHtml = (template, raw, d, r) =>
  template.replace(/<title>[^<]*<\/title>/, "").replace("<!--SEO_HEAD-->", headTags(r, d) + preload(raw, r)).replace("<!--SEO_BODY-->", renderStatic(r, d));
