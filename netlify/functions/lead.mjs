// Runs after a lead is saved: emails you, and sends QUALIFIED leads to Meta Conversions API and TikTok Events API.
// Secrets (API keys and tokens) live in Netlify environment variables, never in the website or the admin.
import crypto from "node:crypto";
import { SEED } from "../../src/content/seed.js";
import { mergeData } from "../../src/lib/data.js";
import { ensureCore, evaluate, toLeadParts } from "../../src/lib/leadform.js";
import { escapeHtml as e } from "../../src/lib/md.js";
import { loadRaw } from "../../src/lib/firestoreRest.js";

const sha = v => crypto.createHash("sha256").update(String(v)).digest("hex");
const low = v => String(v || "").trim().toLowerCase();
const digits = v => String(v || "").replace(/\D/g, "");
const hashed = (v, f = low) => { const x = f(v); return x ? [sha(x)] : undefined; };
const strip = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "" && v !== null));

export function metaPayload({ eventId, top, qualified, tracking, ip, testCode, now }) {
  const [fn, ...ln] = String(top.name || "").trim().split(/\s+/);
  return strip({ data: [{ event_name: "Lead", event_time: now, event_id: eventId, event_source_url: tracking.url, action_source: "website", user_data: strip({ em: hashed(top.email), ph: hashed(top.phone, digits), fn: hashed(fn), ln: hashed(ln.join(" ")), client_ip_address: ip, client_user_agent: tracking.ua, fbp: tracking.fbp, fbc: tracking.fbc }), custom_data: strip({ lead_type: qualified ? "qualified" : "unqualified", service: top.service }) }], test_event_code: testCode });
}
export function tiktokPayload({ eventId, top, tracking, ip, pixel, testCode, now }) {
  return strip({ event_source: "web", event_source_id: pixel, test_event_code: testCode, data: [{ event: "SubmitForm", event_time: now, event_id: eventId, user: strip({ email: top.email ? sha(low(top.email)) : "", phone: digits(top.phone) ? sha(digits(top.phone)) : "", ip, user_agent: tracking.ua, ttclid: tracking.ttclid, ttp: tracking.ttp }), page: strip({ url: tracking.url, referrer: tracking.referrer }), properties: { content_type: "lead" } }] });
}

export function emailContent({ top, answers, qualified, reasons, tracking, site, attr }) {
  const row = (k, v, link) => v ? `<tr><td style="padding:8px 14px;color:#667;vertical-align:top;white-space:nowrap">${e(k)}</td><td style="padding:8px 14px;color:#101821">${link ? `<a href="${e(link)}">${e(v)}</a>` : e(v).replace(/\n/g, "<br/>")}</td></tr>` : "";
  const rows = [row("Name", top.name), row("Email", top.email, "mailto:" + top.email), row("Phone", top.phone, digits(top.phone) ? "https://wa.me/" + digits(top.phone) : ""), row("Company", top.company), row("Service", top.service), row("Message", top.message), ...Object.values(answers).map(x => row(x.q, x.a)), row("Came from", tracking.referrer || "direct"), row("Landing page", attr.landing), row("Campaign", [attr.utm_source, attr.utm_medium, attr.utm_campaign].filter(Boolean).join(" / "))].join("");
  const badge = qualified ? `<span style="background:#0D7948;color:#fff;padding:4px 10px;font-size:12px;font-weight:700">QUALIFIED LEAD</span>` : `<span style="background:#b3261e;color:#fff;padding:4px 10px;font-size:12px;font-weight:700">NOT A FIT</span> <span style="color:#667;font-size:13px">${e(reasons.join("; "))}</span>`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px"><h2 style="margin:0 0 10px">${qualified ? "New lead" : "New enquiry (not a fit)"} from ${e(top.name)}</h2><p>${badge}</p><table style="border-collapse:collapse;width:100%;background:#f5f7f6">${rows}</table><p style="margin-top:18px"><a href="${e(site)}/admin/leads" style="background:#0D7948;color:#fff;padding:11px 18px;text-decoration:none;font-weight:700">Open in admin</a></p><p style="color:#889;font-size:12px">${qualified ? "Reply to this email to answer them directly." : "This lead did not pass your qualifying questions and was not sent to Meta or TikTok."}</p></div>`;
  return { subject: `${qualified ? "New lead" : "[Not a fit]"}: ${top.name}${top.service ? " · " + top.service : ""}`, html };
}

async function post(fetchFn, url, init) {
  try { const r = await fetchFn(url, { ...init, signal: AbortSignal.timeout(8000) }); const t = await r.text().catch(() => ""); return { ok: r.ok, status: r.status, body: t.slice(0, 300) }; }
  catch (err) { return { ok: false, status: 0, body: String(err.message || err) }; }
}

// Core logic, written so it can be tested without the network.
export async function processLead(body, { ip }, env, fetchFn, rawLoader = loadRaw) {
  const raw = await rawLoader(), d = mergeData(SEED, raw), s = d.settings, site = String(s.url || "").replace(/\/$/, "");
  const fields = ensureCore(d.formfields), values = body.values && typeof body.values === "object" ? body.values : {};
  const tracking = { consent: "", url: "", referrer: "", fbp: "", fbc: "", ttp: "", ttclid: "", ua: "", ...(body.tracking || {}) };
  const { qualified, reasons } = evaluate(fields, values);               // the server decides, not the browser
  const { top, answers } = toLeadParts(fields, values);
  const eventId = String(body.id || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40) || crypto.randomUUID();
  const attr = { landing: "", ...(body.attr || {}) }, now = Math.floor(Date.now() / 1000), out = { qualified, email: "skipped", meta: "skipped", tiktok: "skipped" };

  const notifyTo = env.LEAD_NOTIFY_EMAIL || s.email;
  if (env.RESEND_API_KEY && notifyTo && (qualified || s.notifyUnqualified !== false)) {
    const mail = emailContent({ top, answers, qualified, reasons, tracking, site, attr });
    const r = await post(fetchFn, "https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" }, body: JSON.stringify({ from: env.RESEND_FROM || "Smart Lead Systems <onboarding@resend.dev>", to: notifyTo.split(",").map(x => x.trim()), subject: mail.subject, html: mail.html, reply_to: top.email }) });
    out.email = r.ok ? "sent" : `failed ${r.status} ${r.body}`;
  }

  const adsOk = tracking.consent === "yes" || s.trackWithoutConsent === true;
  if (!qualified) { out.meta = out.tiktok = "not sent (not a fit)"; return out; }
  if (!adsOk) { out.meta = out.tiktok = "not sent (visitor did not accept cookies)"; return out; }
  if (env.META_CAPI_TOKEN && /^\d{5,20}$/.test(String(s.metaPixelId || ""))) {
    const r = await post(fetchFn, `https://graph.facebook.com/${env.META_GRAPH_VERSION || "v23.0"}/${s.metaPixelId}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(metaPayload({ eventId, top, qualified, tracking, ip, testCode: env.META_TEST_EVENT_CODE, now })) });
    out.meta = r.ok ? "sent" : `failed ${r.status} ${r.body}`;
  }
  if (env.TIKTOK_EVENTS_TOKEN && /^[A-Za-z0-9]{8,32}$/.test(String(s.tiktokPixelId || ""))) {
    const r = await post(fetchFn, "https://business-api.tiktok.com/open_api/v1.3/event/track/", { method: "POST", headers: { "content-type": "application/json", "Access-Token": env.TIKTOK_EVENTS_TOKEN }, body: JSON.stringify(tiktokPayload({ eventId, top, tracking, ip, pixel: s.tiktokPixelId, testCode: env.TIKTOK_TEST_EVENT_CODE, now })) });
    out.tiktok = r.ok ? "sent" : `failed ${r.status} ${r.body}`;
  }
  return out;
}

const hits = new Map();
const limited = ip => { const t = Date.now(), a = (hits.get(ip) || []).filter(x => t - x < 600000); a.push(t); hits.set(ip, a); return a.length > 8; };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const mask = m => String(m || "").split(",")[0].replace(/^(.).*(@.*)$/, "$1***$2");

export default async (req, context) => {
  const env = process.env, ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "";
  if (req.method === "GET") { const raw = await loadRaw().catch(() => ({})), s = mergeData(SEED, raw).settings; return json({ email: !!env.RESEND_API_KEY, notifyTo: mask(env.LEAD_NOTIFY_EMAIL || s.email), meta: !!env.META_CAPI_TOKEN, tiktok: !!env.TIKTOK_EVENTS_TOKEN }); }
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    const origin = req.headers.get("origin"), host = new URL(req.url).host;
    if (!origin) return json({ error: "origin" }, 403);
    const oh = new URL(origin).host, raw = await loadRaw().catch(() => ({})), site = new URL(mergeData(SEED, raw).settings.url).host;
    if (![host, site, "www." + site].includes(oh)) return json({ error: "origin" }, 403);
    if (limited(ip || "x")) return json({ error: "slow down" }, 429);
    const text = await req.text(); if (text.length > 30000) return json({ error: "too large" }, 413);
    return json({ ok: true, ...(await processLead(JSON.parse(text), { ip }, env, fetch)) });
  } catch (err) { console.error("lead function error", err); return json({ ok: false }, 200); }
};
