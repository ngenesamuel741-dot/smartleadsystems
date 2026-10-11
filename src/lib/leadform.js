// Lead form logic shared by the website and the Netlify function, so both agree on what counts as a qualified lead.
import { slugify } from "./md.js";

export const TOP_KEYS = ["name", "email", "phone", "company", "service", "message"];
export const keyOf = f => f.key ? slugify(f.key).replace(/-/g, "_") : slugify(f.label || "question").replace(/-/g, "_");

// Name and Email are always present, even if they were deleted or hidden in the admin.
export function ensureCore(fields) {
  const out = (fields || []).map(f => ({ ...f, key: keyOf(f) }));
  const has = k => out.some(f => f.key === k);
  if (!has("email")) out.unshift({ id: "email", key: "email", label: "Email", type: "email", required: true, options: [], disqualify: [] });
  if (!has("name")) out.unshift({ id: "name", key: "name", label: "Name", type: "text", required: true, options: [], disqualify: [] });
  return out.map(f => (f.key === "name" || f.key === "email") ? { ...f, required: true } : f);
}

export const norm = v => String(v == null ? "" : v).trim().toLowerCase();

// Any answer that matches an item in a question's "disqualifying answers" list makes the lead not-a-fit.
export function evaluate(fields, values) {
  const reasons = [];
  for (const f of fields) {
    const bad = (f.disqualify || []).map(norm).filter(Boolean);
    if (!bad.length) continue;
    const v = norm(values[f.key]);
    if (v && bad.includes(v)) reasons.push(`${f.label}: ${values[f.key]}`);
  }
  return { qualified: reasons.length === 0, reasons };
}

export function validate(fields, values) {
  for (const f of fields) {
    const v = String(values[f.key] ?? "").trim();
    if (f.required && (!v || (f.type === "checkbox" && v !== "Yes"))) return `Please complete: ${f.label}`;
    if (f.key === "email" && !/^\S+@\S+\.\S+$/.test(v)) return "Please enter a valid email address.";
    if (v.length > 4000) return `${f.label} is too long.`;
  }
  return "";
}

// Split values into the top-level lead columns and the custom answers (question + answer, so old leads stay readable).
export function toLeadParts(fields, values) {
  const top = Object.fromEntries(TOP_KEYS.map(k => [k, String(values[k] ?? "").trim()]));
  const answers = {};
  for (const f of fields) if (!TOP_KEYS.includes(f.key)) { const a = String(values[f.key] ?? "").trim(); if (a) answers[f.key] = { q: String(f.label).slice(0, 200), a: a.slice(0, 1000) }; }
  return { top, answers };
}
