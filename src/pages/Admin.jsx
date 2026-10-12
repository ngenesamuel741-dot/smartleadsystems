import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, NavLink, Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, getDoc, setDoc, doc, deleteDoc, updateDoc, writeBatch, orderBy, query } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../firebase";
import { uploadToCloudinary } from "../cloudinary";
import { SEED } from "../content/seed";
import { pendingUpdates } from "../content/update";
import { COLLECTIONS, SETTINGS_GROUPS } from "../content/schema";
import { slugify } from "../lib/md.js";
import { cdn, isVideo } from "../lib/media.js";
import "../admin.css";

let hookCache = null, hookTimer = null;
async function getHook() { if (hookCache !== null) return hookCache; try { const x = await getDoc(doc(db, "private", "config")); hookCache = x.exists() ? (x.data().buildHook || "") : ""; } catch (e) { hookCache = ""; } return hookCache; }
const hookOk = h => /^https:\/\/api\.netlify\.com\/build_hooks\/[A-Za-z0-9]+/.test(h || "");
// Rebuilds the public site (sitemap, static pages) a minute after you stop saving. Needs the Netlify build hook in Site settings.
export function scheduleRebuild() { clearTimeout(hookTimer); hookTimer = setTimeout(async () => { const h = await getHook(); if (hookOk(h)) fetch(h, { method: "POST", mode: "no-cors" }).catch(() => {}); }, 60000); }
async function rebuildNow() { const h = await getHook(); if (!hookOk(h)) return false; await fetch(h, { method: "POST", mode: "no-cors" }).catch(() => {}); return true; }

const toList = v => Array.isArray(v) ? v : String(v || "").split("\n").map(x => x.trim()).filter(Boolean);
const today = () => new Date().toISOString().slice(0, 10);

function Login() {
  const [e, setE] = useState(""), [p, setP] = useState(""), [err, setErr] = useState("");
  return <div className="login"><form onSubmit={async x => { x.preventDefault(); try { await signInWithEmailAndPassword(auth, e, p); } catch (z) { setErr("Sign in failed. Check your email and password."); } }}>
    <small>SMART LEAD SYSTEMS CMS</small><h1>Admin access</h1>
    <input type="email" placeholder="Email" value={e} onChange={x => setE(x.target.value)} autoComplete="username" />
    <input type="password" placeholder="Password" value={p} onChange={x => setP(x.target.value)} autoComplete="current-password" />
    <button>Sign in</button>{err && <p>{err}</p>}</form></div>;
}

function Progress({ pct }) { return pct === null ? null : <span className="prog"><i style={{ width: pct + "%" }} /><b>{pct < 100 ? "Uploading… " + pct + "%" : "Finishing…"}</b></span>; }

// Pick from the phone gallery, take a photo, or record a video. No links needed.
function MediaPicker({ f, value, onChange }) {
  const [pct, setPct] = useState(null), [err, setErr] = useState(""), both = f.t === "media";
  async function pick(ev) {
    const file = ev.target.files[0]; ev.target.value = ""; if (!file) return;
    setErr(""); setPct(0);
    try { onChange(await uploadToCloudinary(file, { kind: both ? "media" : "image", onProgress: setPct })); } catch (x) { setErr(x.message); }
    setPct(null);
  }
  return <div className="fld"><span className="flabel">{f.label}</span>
    <div className="mediabox">
      <div className="thumb">{value ? (isVideo(value) ? <video src={value} muted playsInline controls /> : <img src={cdn(value, { w: 500 })} alt="" />) : <span>{both ? "No photo or video yet" : "No photo yet"}</span>}</div>
      <div className="mediabtns">
        <label className="upload big">{value ? "Replace" : "Upload"} from phone{both ? " (photo or video)" : ""}<input type="file" accept={both ? "image/*,video/*" : "image/*"} onChange={pick} /></label>
        {value && <button type="button" className="linkbtn" onClick={() => onChange("")}>Remove</button>}
        <Progress pct={pct} />{err && <em className="uperr">{err}</em>}
        <details><summary>Use a link instead</summary><input placeholder="https://…" value={value || ""} onChange={e => onChange(e.target.value)} /></details>
      </div>
    </div>{f.hint && <small>{f.hint}</small>}</div>;
}

// Long text with a button to drop a photo or video straight into the text.
function MarkdownField({ f, value, onChange }) {
  const ref = useRef(null), [pct, setPct] = useState(null), [err, setErr] = useState("");
  async function add(ev) {
    const file = ev.target.files[0]; ev.target.value = ""; if (!file) return;
    setErr(""); setPct(0);
    try {
      const url = await uploadToCloudinary(file, { kind: "media", onProgress: setPct }), el = ref.current, text = String(value || "");
      const at = el ? el.selectionStart : text.length, snippet = `\n\n![Describe this ${file.type.startsWith("video/") ? "video" : "photo"} for Google](${url})\n\n`;
      onChange(text.slice(0, at) + snippet + text.slice(at));
    } catch (x) { setErr(x.message); }
    setPct(null);
  }
  return <div className="fld"><span className="flabel">{f.label}</span>
    <textarea ref={ref} className="long" value={value ?? ""} onChange={e => onChange(e.target.value)} />
    <div className="mdtools"><label className="upload">+ Add photo or video here<input type="file" accept="image/*,video/*" onChange={add} /></label><Progress pct={pct} />{err && <em className="uperr">{err}</em>}</div>
    {f.hint && <small>{f.hint}</small>}</div>;
}

// Several photos or videos at once: choose many from the gallery, reorder with the arrows, remove with the cross.
function GalleryField({ f, value, onChange }) {
  const list = Array.isArray(value) ? value : toList(value), vid = f.video !== false;
  const [pct, setPct] = useState(null), [err, setErr] = useState("");
  async function add(ev) {
    const files = [...ev.target.files]; ev.target.value = ""; if (!files.length) return;
    setErr(""); const got = [];
    try { for (let i = 0; i < files.length; i++) { setPct(Math.round((i / files.length) * 100)); got.push(await uploadToCloudinary(files[i], { kind: vid ? "media" : "image", onProgress: p => setPct(Math.round(((i + p / 100) / files.length) * 100)) })); } }
    catch (x) { setErr((got.length ? got.length + " of " + files.length + " uploaded. " : "") + x.message); }
    if (got.length) onChange([...list, ...got]);
    setPct(null);
  }
  const move = (i, d) => { const a = [...list], j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  return <div className="fld"><span className="flabel">{f.label}</span>
    {list.length > 0 && <div className="gal">{list.map((u, i) => <div className="gitem" key={u + i}>{isVideo(u) ? <video src={u} muted playsInline /> : <img src={cdn(u, { w: 300 })} alt="" />}<div className="gbar"><button type="button" onClick={() => move(i, -1)} aria-label="Move earlier">←</button><button type="button" onClick={() => move(i, 1)} aria-label="Move later">→</button><button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} aria-label="Remove">✕</button></div></div>)}</div>}
    <label className="upload big">+ Add {vid ? "photos or videos" : "photos"} (you can choose several)<input type="file" multiple accept={vid ? "image/*,video/*" : "image/*"} onChange={add} /></label>
    <Progress pct={pct} />{err && <em className="uperr">{err}</em>}{f.hint && <small>{f.hint}</small>}</div>;
}

function Field({ f, value, onChange }) {
  if (f.t === "image" || f.t === "media") return <MediaPicker f={f} value={value} onChange={onChange} />;
  if (f.t === "gallery") return <GalleryField f={f} value={value} onChange={onChange} />;
  if (f.t === "markdown") return <MarkdownField f={f} value={value} onChange={onChange} />;
  const shown = f.t === "list" && Array.isArray(value) ? value.join("\n") : value ?? "";
  return <label className="fld">{f.label}
    {f.t === "bool" ? <span className="chk"><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /> Yes</span>
      : f.t === "textarea" || f.t === "list" ? <textarea value={shown} onChange={e => onChange(e.target.value)} />
      : f.t === "select" ? <select value={shown} onChange={e => onChange(e.target.value)}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
      : f.t === "number" ? <input type="number" value={shown} onChange={e => onChange(e.target.value)} />
      : f.t === "date" ? <input type="date" value={shown} onChange={e => onChange(e.target.value)} />
      : <input value={shown} onChange={e => onChange(e.target.value)} />}
    {f.hint && <small>{f.hint}</small>}</label>;
}

function CollectionEditor({ col }) {
  const def = COLLECTIONS[col], seeds = SEED[col] || [];
  const [items, setItems] = useState(null), [cur, setCur] = useState(null), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  const load = useCallback(async () => { try { const s = await getDocs(collection(db, col)); setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))); } catch (e) { setMsg(e.message); setItems([]); } }, [col]);
  useEffect(() => { load(); }, [load]);
  const sorted = (items || []).slice().sort((a, b) => col === "posts" ? String(b.date).localeCompare(String(a.date)) : (Number(a.order) || 999) - (Number(b.order) || 999));
  const blank = () => { const o = {}; def.fields.forEach(f => { o[f.k] = f.t === "bool" ? f.def : f.t === "select" ? f.options[0] : f.t === "list" || f.t === "gallery" ? [] : f.t === "number" ? (items || []).length + 1 : f.t === "date" ? today() : ""; }); if (col === "posts") o.author = SEED.settings.name; return o; };

  async function importDefaults() {
    setBusy(true); try { const b = writeBatch(db); seeds.forEach(s => { const { id, ...rest } = s; b.set(doc(db, col, id), rest); }); await b.commit(); await load(); scheduleRebuild(); setMsg("Default content imported. You can now edit it."); } catch (e) { setMsg(e.message); } setBusy(false);
  }
  async function save() {
    setBusy(true); setMsg("");
    try {
      const data = {};
      def.fields.forEach(f => { const v = cur[f.k]; data[f.k] = f.t === "list" || f.t === "gallery" ? toList(v) : f.t === "number" ? Number(v) || 0 : f.t === "bool" ? !!v : String(v ?? ""); });
      if (!data[def.title].trim()) throw new Error("Please fill in: " + def.fields.find(f => f.k === def.title).label);
      if (col === "posts") { data.slug = slugify(data.slug || data.title); if ((items || []).some(x => x.slug === data.slug && x.id !== cur.id)) throw new Error("Another post already uses this URL slug."); data.updatedAt = today(); }
      const ref = cur.id ? doc(db, col, cur.id) : doc(collection(db, col));
      await setDoc(ref, data); setCur({ ...data, id: ref.id }); await load(); scheduleRebuild(); setMsg("Saved. The public site updates within a few minutes.");
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  }
  async function remove() { if (!window.confirm("Delete this permanently?")) return; try { await deleteDoc(doc(db, col, cur.id)); setCur(null); await load(); scheduleRebuild(); setMsg("Deleted."); } catch (e) { setMsg(e.message); } }

  return <div className="editor"><aside>
    {!def.noNew && <button className="primary" onClick={() => { setCur(blank()); setMsg(""); }}>+ New {def.single}</button>}
    {items === null && <p className="muted">Loading…</p>}
    {sorted.map(x => <button key={x.id} className={cur && cur.id === x.id ? "active" : ""} onClick={() => { setCur({ ...x }); setMsg(""); }}>{x[def.title] || "Untitled"}{col === "posts" && x.published === false ? " (draft)" : ""}</button>)}
    {items && !items.length && seeds.length > 0 && <div className="note"><p>Nothing saved yet. The site is showing built-in default content.</p><button className="primary" disabled={busy} onClick={importDefaults}>Import default content to edit it</button></div>}
    {items && !items.length && !seeds.length && <p className="muted">Nothing here yet. This section stays hidden on the site until you add something.</p>}
  </aside>
  <section className="edit">{cur ? <>
    <div className="edithead"><div><small>{def.label.toUpperCase()}</small><h2>{cur[def.title] || "New " + def.single}</h2></div><button className="primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button></div>
    {def.fields.map(f => <Field key={f.k} f={f} value={cur[f.k]} onChange={v => setCur(c => ({ ...c, [f.k]: v }))} />)}
    {cur.id && !def.noDelete && <button className="delete" onClick={remove}>Delete</button>}
  </> : <div><h2>{def.label}</h2><p className="muted">Choose an item on the left{def.noNew ? "" : ", or create a new one"}.</p></div>}
  {msg && <p className="msg">{msg}</p>}</section></div>;
}

const SETTING_TYPES = Object.fromEntries(SETTINGS_GROUPS.flatMap(([, fs]) => fs).map(f => [f.k, f.t]));

function Integrations() {
  const [st, setSt] = useState(null), [tm, setTm] = useState(""), [busy, setBusy] = useState(false);
  async function sendTest() {
    setBusy(true); setTm("Sending…");
    try { const token = await auth.currentUser.getIdToken(), r = await fetch("/.netlify/functions/lead?action=test", { method: "POST", headers: { Authorization: "Bearer " + token } }), j = await r.json(); setTm((j.ok ? "✓ " : "✗ ") + j.message); }
    catch (e) { setTm("✗ Could not reach the function. Is the site deployed on Netlify with the latest code?"); }
    setBusy(false);
  }
  useEffect(() => { fetch("/.netlify/functions/lead").then(r => r.json()).then(setSt).catch(() => setSt(false)); }, []);
  const Row = ({ ok, name, env }) => <li className={ok ? "ok" : "no"}><b>{ok ? "Connected" : "Not connected"}</b> {name}{!ok && <small> Add <code>{env}</code> in Netlify → Site configuration → Environment variables, then redeploy.</small>}</li>;
  return <fieldset><legend>Connections (email alerts and ad tracking)</legend>
    {st === null && <p className="muted">Checking…</p>}{st === false && <p className="muted">Not available here. This check works on your live Netlify site.</p>}
    {st && <ul className="status"><Row ok={st.email} name={"Email alerts to " + st.notifyTo} env="RESEND_API_KEY" /><Row ok={st.meta} name="Meta Conversions API" env="META_CAPI_TOKEN" /><Row ok={st.tiktok} name="TikTok Events API" env="TIKTOK_EVENTS_TOKEN" /></ul>}
    <p className="muted">Passwords and tokens go in Netlify (never here). Pixel IDs go in the Tracking section below.</p>
    <button className="primary" disabled={busy} onClick={sendTest}>Send a test email</button>{tm && <p className="msg">{tm}</p>}</fieldset>;
}

function Automation() {
  const [h, setH] = useState(""), [msg, setMsg] = useState("");
  useEffect(() => { getDoc(doc(db, "private", "config")).then(x => { if (x.exists()) setH(x.data().buildHook || ""); }).catch(() => {}); }, []);
  async function save() { try { const cur = (await getDoc(doc(db, "private", "config"))).data() || {}; await setDoc(doc(db, "private", "config"), { ...cur, buildHook: h.trim() }); hookCache = h.trim(); setMsg(h && !hookOk(h) ? "Saved, but this doesn't look like a Netlify build hook URL." : "Saved."); } catch (e) { setMsg(e.message); } }
  return <fieldset><legend>Auto-update the live site (recommended)</legend>
    <label className="fld">Netlify build hook URL<input value={h} onChange={e => setH(e.target.value)} placeholder="https://api.netlify.com/build_hooks/…" /><small>Netlify → Site configuration → Build &amp; deploy → Build hooks → Add build hook. When you save content here, the site rebuilds a minute later so Google sees the new pages and sitemap. Only you can see this field.</small></label>
    <button className="primary" onClick={save}>Save</button> <button onClick={async () => setMsg((await rebuildNow()) ? "Rebuild started. It finishes in about a minute." : "Add and save a valid build hook first.")}>Rebuild site now</button>{msg && <p className="msg">{msg}</p>}</fieldset>;
}

function SettingsEditor() {
  const [v, setV] = useState(null), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => { getDoc(doc(db, "settings", "site")).then(s => setV({ ...SEED.settings, ...(s.exists() ? s.data() : {}) })).catch(e => { setMsg(e.message); setV({ ...SEED.settings }); }); }, []);
  async function save() { setBusy(true); try { const data = {}; Object.keys(SEED.settings).forEach(k => { data[k] = SETTING_TYPES[k] === "bool" ? v[k] === true || v[k] === "true" : String(v[k] ?? ""); }); await setDoc(doc(db, "settings", "site"), data); scheduleRebuild(); setMsg("Saved. The public site updates within a few minutes."); } catch (e) { setMsg(e.message); } setBusy(false); }
  if (!v) return <p className="muted">Loading…</p>;
  return <div className="settings"><div className="edithead"><div><small>SITE SETTINGS</small><h2>Site settings</h2></div><button className="primary" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button></div>
    <Integrations /><Automation />
    {SETTINGS_GROUPS.map(([title, fields]) => <fieldset key={title}><legend>{title}</legend>{fields.map(f => <Field key={f.k} f={f} value={v[f.k]} onChange={x => setV(o => ({ ...o, [f.k]: x }))} />)}</fieldset>)}
    {msg && <p className="msg">{msg}</p>}</div>;
}

const ts = x => x.createdAt && x.createdAt.toDate ? x.createdAt.toDate() : null;
const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
const fmt = d => d ? d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
const isQ = x => x.qualified !== false;
const stamp = () => new Date().toISOString().slice(0, 10);
const answerOf = (x, q) => { const a = Object.values(x.answers || {}).find(y => y.q === q); return a ? a.a : ""; };
// Columns: the fixed ones, then one column for every custom question you have ever asked, then where the lead came from.
function columnsFor(list) {
  const qs = [...new Set(list.flatMap(x => Object.values(x.answers || {}).map(a => a.q)))];
  return [["Date", x => fmt(ts(x))], ["Name", x => x.name], ["Email", x => x.email], ["Phone", x => x.phone], ["Company", x => x.company], ["Service", x => x.service], ["Plan", x => x.plan], ["Message", x => x.message],
    ...qs.map(q => [q, x => answerOf(x, q)]), ["Qualified", x => isQ(x) ? "Yes" : "No"], ["Not-a-fit reason", x => x.qualReason], ["Status", x => x.status || "new"],
    ["Came from", x => x.source], ["Landing page", x => x.landing], ["Campaign", x => x.attribution ? [x.attribution.utm_source, x.attribution.utm_medium, x.attribution.utm_campaign].filter(Boolean).join(" / ") : ""]];
}
const rowsFor = (list, cols) => list.map(x => Object.fromEntries(cols.map(([h, f]) => [h, f(x) || ""])));

async function exportXlsx(list) {
  const cols = columnsFor(list), XLSX = await import("xlsx"), ws = XLSX.utils.json_to_sheet(rowsFor(list, cols)), wb = XLSX.utils.book_new();
  ws["!cols"] = cols.map(([h]) => ({ wch: h === "Message" ? 60 : h === "Date" ? 20 : 24 }));
  XLSX.utils.book_append_sheet(wb, ws, "Leads"); XLSX.writeFile(wb, `smart-lead-leads-${stamp()}.xlsx`);
}
function exportCsv(list) {
  const cols = columnsFor(list), esc = v => '"' + String(v).replace(/"/g, '""') + '"', rows = rowsFor(list, cols);
  const csv = "\ufeff" + [cols.map(([h]) => esc(h)).join(","), ...rows.map(r => cols.map(([h]) => esc(r[h])).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = `smart-lead-leads-${stamp()}.csv`; a.click(); URL.revokeObjectURL(a.href);
}

function Leads() {
  const [items, setItems] = useState(null), [msg, setMsg] = useState(""), [tab, setTab] = useState("today"), [q, setQ] = useState(""), [st, setSt] = useState("all");
  const load = useCallback(async () => { try { const s = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc"))); setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))); } catch (e) { setMsg(e.message); setItems([]); } }, []);
  useEffect(() => { load(); }, [load]);
  const set = async (id, status) => { try { await updateDoc(doc(db, "leads", id), { status }); load(); } catch (e) { setMsg(e.message); } };
  const rescue = async id => { try { await updateDoc(doc(db, "leads", id), { qualified: true, status: "new", qualReason: "" }); load(); } catch (e) { setMsg(e.message); } };
  const del = async id => { if (window.confirm("Delete this enquiry permanently?")) { try { await deleteDoc(doc(db, "leads", id)); load(); } catch (e) { setMsg(e.message); } } };
  const all = items || [], good = all.filter(isQ), notFit = all.filter(x => !isQ(x)), now = new Date();
  const todayList = good.filter(x => sameDay(ts(x), now)), week = good.filter(x => ts(x) && now - ts(x) < 7 * 864e5);
  const base = tab === "unq" ? notFit : good, needle = q.trim().toLowerCase();
  const filtered = base.filter(x => (st === "all" || (x.status || "new") === st) && (!needle || [x.name, x.email, x.phone, x.company, x.service, x.message, ...Object.values(x.answers || {}).map(a => a.a)].join(" ").toLowerCase().includes(needle)));
  const cols = columnsFor(base);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - i); return [d, good.filter(x => sameDay(ts(x), d)).length]; });
  const StatusSel = x => <select value={x.status || "new"} onChange={e => set(x.id, e.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="won">Won</option><option value="lost">Lost</option></select>;

  const Card = x => <article key={x.id} className={"lead " + (x.status || "new")}><header><div><strong>{x.name}</strong><span>{fmt(ts(x))}</span></div>{StatusSel(x)}</header>
    <p className="lead-meta">{[x.company, x.service, x.plan && "Plan: " + x.plan].filter(Boolean).join(" · ")}</p><p>{x.message}</p>
    {Object.values(x.answers || {}).length > 0 && <ul className="answers">{Object.values(x.answers).map(a => <li key={a.q}><b>{a.q}</b> {a.a}</li>)}</ul>}
    <footer><a href={"mailto:" + x.email}>{x.email}</a>{x.phone && <a href={"https://wa.me/" + String(x.phone).replace(/\D/g, "")} target="_blank" rel="noreferrer">{x.phone}</a>}{x.source && <span className="muted">from {x.source}</span>}<button className="delete" onClick={() => del(x.id)}>Delete</button></footer></article>;

  return <div><small>ENQUIRIES</small><h1>Leads</h1><p className="muted">Everyone who sent a message through the website contact form. Only leads that pass your qualifying questions count as leads.</p>{msg && <p className="msg">{msg}</p>}
    <div className="cards"><div className="stat"><strong>{todayList.length}</strong><span>qualified today</span></div><div className="stat"><strong>{week.length}</strong><span>last 7 days</span></div><div className="stat"><strong>{good.length}</strong><span>all-time qualified leads</span></div><div className="stat"><strong>{good.filter(x => (x.status || "new") === "new").length}</strong><span>not contacted yet</span></div></div>
    <div className="tabs"><button className={tab === "today" ? "on" : ""} onClick={() => setTab("today")}>Today's leads</button><button className={tab === "all" ? "on" : ""} onClick={() => setTab("all")}>All-time leads ({good.length})</button><button className={tab === "unq" ? "on" : ""} onClick={() => setTab("unq")}>Not a fit ({notFit.length})</button></div>
    {items === null && <p className="muted">Loading…</p>}
    {tab === "today" && items && <><div className="leads">{todayList.map(Card)}</div>{!todayList.length && <p className="muted">No qualified leads yet today.</p>}
      <h3>Qualified leads per day (last 14 days)</h3><div className="daily">{days.map(([d, n]) => <div key={d.toDateString()}><span>{d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}</span><b>{n}</b></div>)}</div></>}
    {tab !== "today" && items && <><div className="toolbar"><input placeholder="Search name, email, phone, company, answers…" value={q} onChange={e => setQ(e.target.value)} />{tab === "all" && <select value={st} onChange={e => setSt(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="won">Won</option><option value="lost">Lost</option></select>}
      <button className="primary" disabled={!filtered.length} onClick={() => exportXlsx(filtered)}>Export Excel (.xlsx)</button><button disabled={!filtered.length} onClick={() => exportCsv(filtered)}>Export CSV</button></div>
      {tab === "unq" && <p className="muted">These people answered a qualifying question with a "not a fit" answer. They were not counted as leads in Meta, TikTok or Google. If one looks good, tap "Mark as qualified".</p>}
      <p className="muted">{filtered.length} of {base.length} {tab === "unq" ? "not-a-fit enquiries" : "leads"}{filtered.length !== base.length ? " (filtered). Exports include only the filtered rows." : "."}</p>
      <div className="tablewrap"><table className="leadtable"><thead><tr>{cols.map(([h]) => <th key={h}>{h}</th>)}<th></th></tr></thead><tbody>{filtered.map(x => <tr key={x.id}>{cols.map(([h, f]) => h === "Status" ? <td key={h}>{tab === "unq" ? "Not a fit" : StatusSel(x)}</td> : <td key={h} className={h === "Message" ? "msgcell" : ""}>{f(x)}</td>)}<td>{tab === "unq" && <button onClick={() => rescue(x.id)}>Mark as qualified</button>} <button className="delete" onClick={() => del(x.id)}>Delete</button></td></tr>)}</tbody></table></div>
      {!filtered.length && <p className="muted">Nothing here.</p>}</>}
  </div>;
}

function Overview() {
  const [n, setN] = useState(null), [t, setT] = useState(0), [pending, setPending] = useState([]), [um, setUm] = useState("");
  useEffect(() => { pendingUpdates().then(setPending); }, []);
  async function applyUpdate(u) { if (!window.confirm(u.confirm)) return; setUm("Applying…"); try { await u.apply(); scheduleRebuild(); setPending(p => p.filter(x => x.id !== u.id)); setUm("Done: " + u.title + ". It shows live within a few minutes."); } catch (e) { setUm(e.message); } }
  useEffect(() => { getDocs(collection(db, "leads")).then(s => { const q = s.docs.map(d => d.data()).filter(x => x.qualified !== false); setN(q.filter(x => (x.status || "new") === "new").length); setT(q.filter(x => x.createdAt && x.createdAt.toDate && x.createdAt.toDate().toDateString() === new Date().toDateString()).length); }).catch(() => setN(-1)); }, []);
  return <div><small>CONTROL ROOM</small><h1>Smart Lead Systems CMS</h1><p className="muted">Everything on the public website is edited here.</p>
    <div className="cards"><Link to="/admin/leads"><strong>{n === null ? "…" : n < 0 ? "!" : n}</strong><span>{n < 0 ? "Can't read leads. Check your admin email in firestore.rules" : `not contacted yet · ${t} today`}</span></Link>
      <Link to="/admin/c/posts"><strong>Write</strong><span>a new blog post</span></Link><Link to="/admin/settings"><strong>Edit</strong><span>hero, contact & tracking</span></Link><a href="/" target="_blank" rel="noreferrer"><strong>View</strong><span>the live site</span></a></div>
    {pending.map(u => <div className="note update" key={u.id}><h3>New update: {u.title}</h3><p>{u.text}</p><button className="primary" onClick={() => applyUpdate(u)}>Apply update</button></div>)}{um && <p className="msg">{um}</p>}
    <h2>Tips for ranking on Google and AI assistants</h2><ul className="tips"><li>Write articles that answer a real question your customers ask. Use ## headings, short paragraphs and lists.</li><li>Fill in the excerpt, cover image and cover image description on every post.</li><li>Add your founder photo and bio under Founder, and your social links under Site settings.</li><li>New posts appear in /sitemap.xml, /rss.xml and /llms.txt automatically. Submit /sitemap.xml once in Google Search Console.</li></ul></div>;
}

function ColRoute() { const { col } = useParams(); return COLLECTIONS[col] ? <CollectionEditor key={col} col={col} /> : <p>Unknown section.</p>; }

function Dashboard() {
  const link = (to, label, end) => <NavLink key={to} to={to} end={end}>{label}</NavLink>;
  return <div className="dash"><aside><Link to="/admin" className="brand"><b>SL</b> CMS</Link>
    {link("/admin", "Overview", true)}{link("/admin/leads", "Leads")}{link("/admin/settings", "Site settings")}
    {Object.entries(COLLECTIONS).map(([k, d]) => link("/admin/c/" + k, d.label))}
    <button onClick={() => signOut(auth)}>Sign out</button></aside>
    <main><Routes><Route path="/" element={<Overview />} /><Route path="/settings" element={<SettingsEditor />} /><Route path="/leads" element={<Leads />} /><Route path="/c/:col" element={<ColRoute />} /></Routes></main></div>;
}

export default function Admin() {
  const [u, setU] = useState(undefined);
  useEffect(() => { if (!auth) { setU(null); return undefined; } return onAuthStateChanged(auth, setU); }, []);
  return <><Helmet><title>Admin</title><meta name="robots" content="noindex,nofollow" /></Helmet>
    {!firebaseConfigured ? <div className="login"><div><h1>Connect Firebase first</h1><p>Fill the Firebase values in src/config.js, enable Email/Password sign-in and Firestore, then return here.</p></div></div> : u === undefined ? <div className="login"><div><p>Loading…</p></div></div> : u ? <Dashboard /> : <Login />}</>;
}
