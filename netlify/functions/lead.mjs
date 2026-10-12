// Runs after a lead is saved: emails you, and sends QUALIFIED leads to Meta Conversions API and TikTok Events API.
// Secrets (API keys and tokens) live in Netlify environment variables, never in the website or the admin.
// Everything this function does is written to the Netlify function log (Netlify -> Logs -> Functions -> lead).
import crypto from "node:crypto";
import { SEED } from "../../src/content/seed.js";
import { mergeData } from "../../src/lib/data.js";
import { ensureCore, evaluate, toLeadParts } from "../../src/lib/leadform.js";
import { escapeHtml as e } from "../../src/lib/md.js";
import { loadRaw } from "../../src/lib/firestoreRest.js";
import { firebaseConfig, adminEmail } from "../../src/config.js";

const sha = v => crypto.createHash("sha256").update(String(v)).digest("hex");
const low = v => String(v || "").trim().toLowerCase();
const digits = v => String(v || "").replace(/\D/g, "");
const hashed = (v, f = low) => { const x = f(v); return x ? [sha(x)] : undefined; };
const strip = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "" && v !== null));
const FROM_DEFAULT = "Smart Lead Systems <onboarding@resend.dev>";

// Who receives lead alerts: the Netlify variable first, then the admin setting, then the admin sign-in email.
export const notifyAddress = (env, s) => (env.LEAD_NOTIFY_EMAIL || s.leadNotifyEmail || adminEmail || "").trim();

export function metaPayload({ eventId, top, qualified, tracking, ip, testCode, now }) {
  const [fn, ...ln] = String(top.name || "").trim().split(/\s+/);
  return strip({ data: [{ event_name: "Lead", event_time: now, event_id: eventId, event_source_url: tracking.url, action_source: "website", user_data: strip({ em: hashed(top.email), ph: hashed(top.phone, digits), fn: hashed(fn), ln: hashed(ln.join(" ")), client_ip_address: ip, client_user_agent: tracking.ua, fbp: tracking.fbp, fbc: tracking.fbc }), custom_data: strip({ lead_type: qualified ? "qualified" : "unqualified", service: top.service }) }], test_event_code: testCode });
}
export function tiktokPayload({ eventId, top, tracking, ip, pixel, testCode, now }) {
  return strip({ event_source: "web", event_source_id: pixel, test_event_code: testCode, data: [{ event: "SubmitForm", event_time: now, event_id: eventId, user: strip({ email: top.email ? sha(low(top.email)) : "", phone: digits(top.phone) ? sha(digits(top.phone)) : "", ip, user_agent: tracking.ua, ttclid: tracking.ttclid, ttp: tracking.ttp }), page: strip({ url: tracking.url, referrer: tracking.referrer }), properties: { content_type: "lead" } }] });
}

export function emailContent({ top, answers, qualified, reasons, tracking, site, attr, plan }) {
  const row = (k, v, link) => v ? `<tr><td style="padding:8px 14px;color:#667;vertical-align:top;white-space:nowrap">${e(k)}</td><td style="padding:8px 14px;color:#101821">${link ? `<a href="${e(link)}">${e(v)}</a>` : e(v).replace(/\n/g, "<br/>")}</td></tr>` : "";
  const rows = [row("Name", top.name), row("Email", top.email, "mailto:" + top.email), row("Phone", top.phone, digits(top.phone) ? "https://wa.me/" + digits(top.phone) : ""), row("Company", top.company), row("Service", top.service), row("Package", top.plan || plan), row("Message", top.message), ...Object.values(answers).map(x => row(x.q, x.a)), row("Came from", tracking.referrer || "direct"), row("Landing page", attr.landing), row("Campaign", [attr.utm_source, attr.utm_medium, attr.utm_campaign].filter(Boolean).join(" / "))].join("");
  const badge = qualified ? `<span style="background:#0D7948;color:#fff;padding:4px 10px;font-size:12px;font-weight:700">QUALIFIED LEAD</span>` : `<span style="background:#b3261e;color:#fff;padding:4px 10px;font-size:12px;font-weight:700">NOT A FIT</span> <span style="color:#667;font-size:13px">${e(reasons.join("; "))}</span>`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px"><h2 style="margin:0 0 10px">${qualified ? "New lead" : "New enquiry (not a fit)"} from ${e(top.name)}</h2><p>${badge}</p><table style="border-collapse:collapse;width:100%;background:#f5f7f6">${rows}</table><p style="margin-top:18px"><a href="${e(site)}/admin/leads" style="background:#0D7948;color:#fff;padding:11px 18px;text-decoration:none;font-weight:700">Open in admin</a></p><p style="color:#889;font-size:12px">${qualified ? "Reply to this email to answer them directly." : "This lead did not pass your qualifying questions and was not sent to Meta or TikTok."}</p></div>`;
  return { subject: `${qualified ? "New lead" : "[Not a fit]"}: ${top.name}${top.service ? " · " + top.service : ""}`, html };
}

async function post(fetchFn, url, init) {
  try { const r = await fetchFn(url, { ...init, signal: AbortSignal.timeout(8000) }); const t = await r.text().catch(() => ""); return { ok: r.ok, status: r.status, body: t.slice(0, 400) }; }
  catch (err) { return { ok: false, status: 0, body: String(err.message || err) }; }
}

// Sends through Resend. If Resend refuses because the free test sender may only email its owner, it reads the owner's
// address from the error and sends there instead, so alerts are never lost.
export async function sendMail({ env, to, subject, html, replyTo }, fetchFn) {
  const attempt = async list => post(fetchFn, "https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" }, body: JSON.stringify(strip({ from: env.RESEND_FROM || FROM_DEFAULT, to: list, subject, html, reply_to: replyTo })) });
  const list = String(to).split(",").map(x => x.trim()).filter(Boolean);
  let r = await attempt(list);
  if (!r.ok && r.status === 403) {
    const owner = (r.body.match(/own email address \(([^)\s]+@[^)\s]+)\)/i) || [])[1];
    if (owner && !list.map(x => x.toLowerCase()).includes(owner.toLowerCase())) {
      console.warn(`Resend only allows its free sender to email ${owner}. Retrying to that address. To email other addresses, verify your domain in Resend and set RESEND_FROM.`);
      const r2 = await attempt([owner]);
      if (r2.ok) return { ok: true, status: r2.status, body: r2.body, note: `Sent to ${owner} instead of ${list.join(", ")} (free Resend sender can only email the account owner).` };
      r = r2;
    }
  }
  return { ...r, note: "" };
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

  const notifyTo = notifyAddress(env, s);
  if (!env.RESEND_API_KEY) out.email = "skipped (RESEND_API_KEY is not set in Netlify)";
  else if (!qualified && s.notifyUnqualified === false) out.email = "skipped (not-a-fit alerts are off)";
  else if (!notifyTo) out.email = "skipped (no address to send to)";
  else {
    const mail = emailContent({ top, answers, qualified, reasons, tracking, site, attr });
    const r = await sendMail({ env, to: notifyTo, subject: mail.subject, html: mail.html, replyTo: top.email }, fetchFn);
    out.email = r.ok ? "sent" + (r.note ? " (" + r.note + ")" : "") : `failed ${r.status} ${r.body}`;
  }

  const adsOk = tracking.consent === "yes" || s.trackWithoutConsent === true;
  if (!qualified) { out.meta = out.tiktok = "not sent (not a fit)"; }
  else if (!adsOk) { out.meta = out.tiktok = "not sent (visitor did not accept cookies)"; }
  else {
    if (env.META_CAPI_TOKEN && /^\d{5,20}$/.test(String(s.metaPixelId || ""))) {
      const r = await post(fetchFn, `https://graph.facebook.com/${env.META_GRAPH_VERSION || "v23.0"}/${s.metaPixelId}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(metaPayload({ eventId, top, qualified, tracking, ip, testCode: env.META_TEST_EVENT_CODE, now })) });
      out.meta = r.ok ? "sent" : `failed ${r.status} ${r.body}`;
    }
    if (env.TIKTOK_EVENTS_TOKEN && /^[A-Za-z0-9]{8,32}$/.test(String(s.tiktokPixelId || ""))) {
      const r = await post(fetchFn, "https://business-api.tiktok.com/open_api/v1.3/event/track/", { method: "POST", headers: { "content-type": "application/json", "Access-Token": env.TIKTOK_EVENTS_TOKEN }, body: JSON.stringify(tiktokPayload({ eventId, top, tracking, ip, pixel: s.tiktokPixelId, testCode: env.TIKTOK_TEST_EVENT_CODE, now })) });
      out.tiktok = r.ok ? "sent" : `failed ${r.status} ${r.body}`;
    }
  }
  console.log(`lead ${eventId} qualified=${qualified} email=${out.email} meta=${out.meta} tiktok=${out.tiktok}`);
  return out;
}

// ---- admin-only test email: proves the Resend key, sender and address work, and shows Resend's exact answer ----
const b64u = x => Buffer.from(x, "base64url").toString("utf8");
let certCache = { at: 0, certs: null };
async function googleCerts(fetchFn) {
  if (certCache.certs && Date.now() - certCache.at < 3600000) return certCache.certs;
  const r = await fetchFn("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"); certCache = { at: Date.now(), certs: await r.json() }; return certCache.certs;
}
export async function verifyAdminToken(token, env, fetchFn) {
  try { return await verifyToken(token, env, fetchFn); } catch (err) { return null; }   // anything malformed simply means "not signed in"
}
async function verifyToken(token, env, fetchFn) {
  const [h, p, sig] = String(token || "").split("."); if (!h || !p || !sig) return null;
  const header = JSON.parse(b64u(h)), payload = JSON.parse(b64u(p)), pid = firebaseConfig.projectId;
  if (header.alg !== "RS256") return null;
  const cert = (await googleCerts(fetchFn))[header.kid]; if (!cert) return null;
  if (!crypto.createVerify("RSA-SHA256").update(h + "." + p).verify(cert, Buffer.from(sig, "base64url"))) return null;
  if (payload.aud !== pid || payload.iss !== "https://securetoken.google.com/" + pid || payload.exp * 1000 < Date.now()) return null;
  const admins = (env.ADMIN_EMAILS || adminEmail).split(",").map(low);
  return admins.includes(low(payload.email)) ? low(payload.email) : null;
}

export async function sendTest(env, fetchFn, rawLoader = loadRaw) {
  const s = mergeData(SEED, await rawLoader().catch(() => ({}))).settings, to = notifyAddress(env, s);
  if (!env.RESEND_API_KEY) return { ok: false, to, message: "RESEND_API_KEY is not set in Netlify. Add it under Site configuration → Environment variables, then redeploy." };
  const r = await sendMail({ env, to, subject: "Test: Smart Lead Systems lead alerts work", html: `<div style="font-family:Arial,sans-serif"><h2>It works.</h2><p>This is a test email from your website. When a lead fills in your contact form, you will get an email like this one.</p></div>` }, fetchFn);
  console.log(`test email to=${to} ok=${r.ok} status=${r.status} ${r.body}`);
  return { ok: r.ok, to, from: env.RESEND_FROM || FROM_DEFAULT, status: r.status, message: r.ok ? (r.note || `Sent to ${to}. Check your inbox (and Spam).`) : `Resend said ${r.status}: ${r.body}` };
}

const hits = new Map();
const limited = ip => { const t = Date.now(), a = (hits.get(ip) || []).filter(x => t - x < 600000); a.push(t); hits.set(ip, a); return a.length > 8; };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const mask = m => String(m || "").split(",")[0].replace(/^(.).*(@.*)$/, "$1***$2");

export default async (req, context) => {
  const env = process.env, url = new URL(req.url), ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "";
  if (req.method === "GET") { const raw = await loadRaw().catch(() => ({})), s = mergeData(SEED, raw).settings; return json({ email: !!env.RESEND_API_KEY, notifyTo: mask(notifyAddress(env, s)), meta: !!env.META_CAPI_TOKEN, tiktok: !!env.TIKTOK_EVENTS_TOKEN }); }
  if (req.method !== "POST") return json({ error: "method" }, 405);
  try {
    if (url.searchParams.get("action") === "test") {      // only a signed-in admin may trigger this
      const who = await verifyAdminToken((req.headers.get("authorization") || "").replace(/^Bearer\s+/i, ""), env, fetch);
      if (!who) return json({ ok: false, message: "Please sign in to the admin again and retry." }, 401);
      return json(await sendTest(env, fetch));
    }
    const origin = req.headers.get("origin"), host = url.host;
    if (!origin) return json({ error: "origin" }, 403);
    const oh = new URL(origin).host, raw = await loadRaw().catch(() => ({})), site = new URL(mergeData(SEED, raw).settings.url).host;
    if (![host, site, "www." + site].includes(oh)) { console.warn("lead rejected: origin", oh, "expected", host, site); return json({ error: "origin" }, 403); }
    if (limited(ip || "x")) return json({ error: "slow down" }, 429);
    const text = await req.text(); if (text.length > 30000) return json({ error: "too large" }, 413);
    return json({ ok: true, ...(await processLead(JSON.parse(text), { ip }, env, fetch)) });
  } catch (err) { console.error("lead function error", err); return json({ ok: false }, 200); }
};
