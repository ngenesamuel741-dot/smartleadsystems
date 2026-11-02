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
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^\w_])__([^_]+)__(?=[^\w_]|$)/g, "$1<strong>$2</strong>").replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>").replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

const RE_UL = /^\s*[-*•]\s+/, RE_OL = /^\s*(\d+)[.)]\s+/, RE_BQ = /^>\s?/, RE_H = /^(#{1,4})\s+(.*)$/, RE_INDENT = /^(\s{2,}|\t)\S/;
// A line that is only bold, e.g. **Why speed matters** or **1. Why speed matters**: written as a sub-heading, it is shown as one.
const RE_BOLD_ONLY = /^(?:\*\*|__)(.+?)(?:\*\*|__)\s*:?$/;
const isOl = l => RE_OL.test(l), isUl = l => RE_UL.test(l) && !/^\s*\*\*/.test(l);
const nextNonBlank = (lines, i) => { while (i < lines.length && !lines[i].trim()) i++; return i; };

// Collects one list. Blank lines between items do NOT break the list, and indented lines belong to the item above,
// so "1. A", blank, "2. B" stays one list instead of two lists that both start at 1.
function collectList(lines, i, test, strip) {
  const items = [];
  while (i < lines.length) {
    const line = lines[i];
    if (test(line)) { const m = line.match(RE_OL); items.push({ n: m && test === isOl ? Number(m[1]) : 0, parts: [line.replace(strip, "").trim()] }); i++; continue; }
    if (!line.trim()) { const j = nextNonBlank(lines, i); if (j < lines.length && (test(lines[j]) || RE_INDENT.test(lines[j]))) { i = j; continue; } break; }
    if (RE_INDENT.test(line) || (!RE_H.test(line) && !RE_BQ.test(line) && !isUl(line) && !isOl(line) && !/^---+$/.test(line.trim()))) { if (!items.length) break; items[items.length - 1].parts.push(line.trim()); i++; continue; }
    break;
  }
  return { items, i };
}
const liHtml = it => { const t = it.parts.join(" "), head = RE_BOLD_ONLY.test(t.trim()); return `<li${head ? ' class="li-head"' : ""}>${inline(t)}</li>`; };

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
    if (isUl(line)) { const r = collectList(lines, i, isUl, RE_UL); i = r.i; out.push("<ul>" + r.items.map(liHtml).join("") + "</ul>"); continue; }
    if (isOl(line)) { const r = collectList(lines, i, isOl, RE_OL); i = r.i; const n = r.items[0].n; out.push(`<ol${n > 1 ? ` start="${n}"` : ""}>` + r.items.map(liHtml).join("") + "</ol>"); continue; }
    const p = [];
    while (i < lines.length && lines[i].trim() && !RE_H.test(lines[i]) && !RE_BQ.test(lines[i]) && !isUl(lines[i]) && !isOl(lines[i]) && !/^---+$/.test(lines[i].trim())) { p.push(lines[i]); i++; }
    if (!p.length) { p.push(lines[i]); i++; }
    const one = p.length === 1 && p[0].trim().match(RE_BOLD_ONLY);
    if (one) { const txt = one[1].trim(); out.push(`<h3 id="${slugify(txt)}">${inline(txt)}</h3>`); continue; }
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return out.join("\n");
}

export const stripMd = s => String(s || "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#>*_`~-]+/g, " ").replace(/\s+/g, " ").trim();
export const readingMinutes = s => Math.max(1, Math.round(stripMd(s).split(/\s+/).filter(Boolean).length / 200));
