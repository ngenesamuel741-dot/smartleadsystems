// Analytics and ad pixels only load after the visitor accepts cookies (unless you turn that off in Site settings).
import { getAttribution } from "./attribution";
const ok = (v, re) => typeof v === "string" && re.test(v);
let loaded = "";
export const getConsent = () => { try { return localStorage.getItem("sl_consent") || ""; } catch (e) { return ""; } };
export const setConsent = v => { try { localStorage.setItem("sl_consent", v); } catch (e) { /* ignore */ } window.dispatchEvent(new Event("sl-consent")); };

export function initTracking(gaId, pixelId, tiktokId) {
  const key = [gaId, pixelId, tiktokId].join("|"); if (loaded === key) return; loaded = key;
  if (ok(gaId, /^[A-Za-z0-9-]{4,30}$/)) {
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", gaId, { send_page_view: false });
    const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId; document.head.appendChild(s);
  }
  if (ok(pixelId, /^\d{5,20}$/)) {
    (function (f, b, e, v) { if (f.fbq) return; const n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = "2.0"; n.queue = []; const t = b.createElement(e); t.async = true; t.src = v; const s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixelId);
  }
  if (ok(tiktokId, /^[A-Za-z0-9]{8,32}$/)) {
    (function (w, d, t) {
      w.TiktokAnalyticsObject = t; const ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (o, m) { o[m] = function () { o.push([m].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (id) { const inst = ttq._i[id] || []; for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(inst, ttq.methods[n]); return inst; };
      ttq.load = function (id, opts) { const u = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[id] = []; ttq._i[id]._u = u; ttq._t = ttq._t || {}; ttq._t[id] = +new Date(); ttq._o = ttq._o || {}; ttq._o[id] = opts || {}; const s = d.createElement("script"); s.type = "text/javascript"; s.async = true; s.src = u + "?sdkid=" + id + "&lib=" + t; const f = d.getElementsByTagName("script")[0]; f.parentNode.insertBefore(s, f); };
      ttq.load(tiktokId); ttq.page();
    })(window, document, "ttq");
  }
}

export const pageview = path => { if (window.gtag) window.gtag("event", "page_view", { page_path: path }); if (window.fbq) window.fbq("track", "PageView"); if (window.ttq && window.ttq.page && window.__ttqStarted) window.ttq.page(); window.__ttqStarted = true; };
// A qualified lead. eventId is shared with the server-side event so Meta and TikTok count it once.
export const trackLead = eventId => {
  if (window.gtag) window.gtag("event", "generate_lead", { transaction_id: eventId });
  if (window.fbq) window.fbq("track", "Lead", {}, { eventID: eventId });
  if (window.ttq && window.ttq.track) window.ttq.track("SubmitForm", {}, { event_id: eventId });
};
export const trackContact = () => { if (window.gtag) window.gtag("event", "contact_click"); if (window.fbq) window.fbq("track", "Contact"); if (window.ttq && window.ttq.track) window.ttq.track("Contact"); };

const cookie = n => { const m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)")); return m ? decodeURIComponent(m[1]) : ""; };
// Browser details the server needs to match the lead to the ad click (Meta/TikTok Conversions API).
export function trackingContext() {
  const a = getAttribution(), p = a.params || {};
  return { consent: getConsent(), url: window.location.href, referrer: a.referrer || "", fbp: cookie("_fbp"), fbc: cookie("_fbc") || (p.fbclid ? `fb.1.${Date.now()}.${p.fbclid}` : ""), ttp: cookie("_ttp"), ttclid: p.ttclid || "", ua: navigator.userAgent };
}
