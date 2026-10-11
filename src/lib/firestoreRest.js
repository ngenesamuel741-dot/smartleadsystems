import { COLS } from "./data.js";
import { firebaseConfig } from "../config.js";

const FS = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const val = v => "stringValue" in v ? v.stringValue : "integerValue" in v ? Number(v.integerValue) : "doubleValue" in v ? v.doubleValue : "booleanValue" in v ? v.booleanValue : "timestampValue" in v ? v.timestampValue : "arrayValue" in v ? (v.arrayValue.values || []).map(val) : "mapValue" in v ? fields(v.mapValue.fields) : null;
const fields = f => Object.fromEntries(Object.entries(f || {}).map(([k, v]) => [k, val(v)]));

async function listCol(col) {
  const rows = []; let token = "";
  do {
    const r = await fetch(`${FS}/${col}?pageSize=300${token ? "&pageToken=" + encodeURIComponent(token) : ""}`, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) throw new Error(col + " " + r.status);
    const j = await r.json();
    (j.documents || []).forEach(doc => rows.push({ id: doc.name.split("/").pop(), ...fields(doc.fields) }));
    token = j.nextPageToken || "";
  } while (token);
  return rows;
}

let cache = { at: 0, raw: null };
export async function loadRaw() {
  if (cache.raw && Date.now() - cache.at < 60000) return cache.raw;
  const raw = {};
  try {
    const [settings, ...rest] = await Promise.all([
      fetch(`${FS}/settings/site`, { signal: AbortSignal.timeout(4000) }).then(r => r.ok ? r.json() : null),
      ...COLS.map(c => listCol(c))
    ]);
    if (settings && settings.fields) raw.settings = fields(settings.fields);
    COLS.forEach((c, i) => { raw[c] = rest[i]; });
  } catch (err) { console.error("Firestore read failed, using defaults:", err.message); }
  cache = { at: Date.now(), raw };
  return raw;
}


export const FS_BASE = FS;
