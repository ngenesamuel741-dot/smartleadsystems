// Remembers where a visitor came from (ad campaign, Google, ChatGPT...) so each lead can show its source.
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "ttclid", "gclid"];
const STORE = "sl_attr";

export function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search), found = {};
    KEYS.forEach(k => { const v = q.get(k); if (v) found[k] = v.slice(0, 200); });
    const prev = JSON.parse(sessionStorage.getItem(STORE) || "null");
    if (!prev) sessionStorage.setItem(STORE, JSON.stringify({ landing: window.location.pathname.slice(0, 200), referrer: (document.referrer || "").slice(0, 200), params: found }));
    else if (Object.keys(found).length) { prev.params = { ...prev.params, ...found }; sessionStorage.setItem(STORE, JSON.stringify(prev)); }
  } catch (e) { /* storage blocked: ignore */ }
}

export function getAttribution() {
  try { return JSON.parse(sessionStorage.getItem(STORE) || "null") || { landing: "", referrer: "", params: {} }; } catch (e) { return { landing: "", referrer: "", params: {} }; }
}
