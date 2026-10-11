// Tiny, safe markdown renderer shared by the website and the SEO function.
// Everything is HTML-escaped first, so admin-authored text can never inject scripts.
import { isVideo, cdn, poster } from "./media.js";
export const escapeHtml = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
const safeUrl = u => (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u) ? u : "#");

function inline(t) {
  let s = escapeHtml(t);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => isVideo(u) ? `<video src="${safeUrl(cdn(u))}" poster="${safeUrl(poster(u))}" controls playsinline preload="metadata" aria-label="${a}"></video>` : `<img src="${safeUrl(cdn(u, { w: 1400 }))}" alt="${a}" loading="lazy"/>`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => `<a href="${safeUrl(u)}"${/^https?:/i.test(u) ? ' rel="noopener" target="_blank"' : ""}>${a}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>").replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

const RE_UL = /^\s*[-*]\s+/, RE_OL = /^\s*\d+[.)]\s+/, RE_BQ = /^>\s?/, RE_H = /^(#{1,4})\s+(.*)$/;

export function mdToHtml(src) {
  const lines = String(src || "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(RE_H))) {
      const lvl = Math.min(Math.max(m[1].length, 2), 4), txt = m[2].trim();
      out.push(`<h${lvl} id="${slugify(txt)}">${inline(txt)}</h${lvl}>`); i++; continue;
    }
    if (/^---+$/.test(line.trim())) { out.push("<hr/>"); i++; continue; }
    if (RE_BQ.test(line)) { const b = []; while (i < lines.length && RE_BQ.test(lines[i])) { b.push(lines[i].replace(RE_BQ, "")); i++; } out.push(`<blockquote>${inline(b.join(" "))}</blockquote>`); continue; }
    if (RE_UL.test(line)) { const b = []; while (i < lines.length && RE_UL.test(lines[i])) { b.push(lines[i].replace(RE_UL, "")); i++; } out.push("<ul>" + b.map(x => `<li>${inline(x)}</li>`).join("") + "</ul>"); continue; }
    if (RE_OL.test(line)) { const b = []; while (i < lines.length && RE_OL.test(lines[i])) { b.push(lines[i].replace(RE_OL, "")); i++; } out.push("<ol>" + b.map(x => `<li>${inline(x)}</li>`).join("") + "</ol>"); continue; }
    const p = [];
    while (i < lines.length && lines[i].trim() && !RE_H.test(lines[i]) && !RE_BQ.test(lines[i]) && !RE_UL.test(lines[i]) && !RE_OL.test(lines[i]) && !/^---+$/.test(lines[i].trim())) { p.push(lines[i]); i++; }
    if (!p.length) { p.push(lines[i]); i++; }
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return out.join("\n");
}

export const stripMd = s => String(s || "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#>*_`~-]+/g, " ").replace(/\s+/g, " ").trim();
export const readingMinutes = s => Math.max(1, Math.round(stripMd(s).split(/\s+/).filter(Boolean).length / 200));
