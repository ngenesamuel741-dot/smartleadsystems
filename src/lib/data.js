// Merges database content over the built-in defaults. Used by the website and by the SEO function.
export const COLS = ["services", "projects", "posts", "pricing", "testimonials", "clients", "founders", "faqs", "process", "industries", "formfields", "pages"];
const LISTS = ["capabilities", "features", "points", "tags", "options", "disqualify", "gallery"];
const asList = v => Array.isArray(v) ? v : typeof v === "string" ? v.split(/\n|,/).map(x => x.trim()).filter(Boolean) : [];
const byOrder = (a, b) => (Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title || a.name || "").localeCompare(String(b.title || b.name || ""));
const clean = row => { const r = { ...row }; LISTS.forEach(k => { if (k in r) r[k] = asList(r[k]); }); return r; };

export function mergeData(seed, raw) {
  raw = raw || {};
  const out = { settings: { ...seed.settings, ...(raw.settings || {}) } };
  for (const c of COLS) {
    let rows = raw[c] && raw[c].length ? raw[c] : seed[c];
    if (c === "pages" && raw.pages && raw.pages.length) {
      const ids = new Set(raw.pages.map(p => p.id));
      rows = [...raw.pages, ...seed.pages.filter(p => !ids.has(p.id))];
    }
    out[c] = rows.map(clean).filter(r => r.visible !== false);
    if (c !== "posts" && c !== "pages") out[c].sort(byOrder);
  }
  out.posts = out.posts.filter(p => p.published !== false).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return out;
}
