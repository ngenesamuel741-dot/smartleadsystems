// The AI blog writer. Runs in the background (up to 15 minutes), started by blog-cron.mjs twice a day or by the
// "Write a draft now" button in Admin -> AI blog writer.
//
// MEMORY (Firebase / Firestore):
//   private/blogwriter  = your settings (topics, voice, on/off, auto-publish)       edited in Admin
//   private/blogmemory  = what the writer remembers: style notes, recent topics     written by this function
//   posts               = the finished post (saved as a DRAFT unless auto-publish is on)
// Every run reads the memory and your latest posts first, so each new post matches how the blog already sounds
// and does not repeat earlier topics.
import crypto from "node:crypto";
import admin from "firebase-admin";
import { SEED } from "../../src/content/seed.js";
import { mergeData } from "../../src/lib/data.js";
import { loadRaw } from "../../src/lib/firestoreRest.js";
import { verifyAdminToken } from "./lead.mjs";
import { DEFAULT_WRITER, RESEARCH_PILLAR, POST_TOOL, systemPrompt, userPrompt, agencyFacts, researchPrompt, pickPillar, checkPost } from "../../src/lib/blogwriter.js";

const secretFor = env => crypto.createHash("sha256").update("blog-writer:" + (env.FIREBASE_SERVICE_ACCOUNT || "")).digest("hex");
const lagosToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

function getDb(env) {
  if (!admin.apps.length) {
    let raw = (env.FIREBASE_SERVICE_ACCOUNT || "").trim();
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set in Netlify. See README section 12.");
    if (!raw.startsWith("{")) raw = Buffer.from(raw, "base64").toString("utf8");
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)) });
  }
  return admin.firestore();
}

// ---- AI providers. Free ones first; each is tried in turn and the next one takes over if one is out of quota or down.
// Set whichever keys you have in Netlify. Order can be changed with AI_PROVIDERS (e.g. "groq,gemini").
const post = async (url, headers, body) => {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(240000) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status}: ${(j.error && (j.error.message || j.error)) || "request failed"}`.slice(0, 300));
  return j;
};
const openai = (url, key, model, extra = {}) => async ({ system, user, json }) => {
  const j = await post(url, { Authorization: "Bearer " + key }, { model, messages: [{ role: "system", content: system }, { role: "user", content: user }], max_tokens: 8000, temperature: 0.8, ...(json ? { response_format: { type: "json_object" } } : {}), ...extra });
  return j.choices && j.choices[0] && j.choices[0].message.content || "";
};
const PROVIDERS = {
  gemini: env => env.GEMINI_API_KEY && (async ({ system, user, json, search }) => {
    const j = await post(`https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL || "gemini-2.5-flash"}:generateContent?key=${env.GEMINI_API_KEY}`, {}, { systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: user }] }], ...(search ? { tools: [{ google_search: {} }] } : {}), generationConfig: { maxOutputTokens: 8000, temperature: 0.8, ...(json ? { responseMimeType: "application/json" } : {}) } });
    return ((j.candidates || [])[0]?.content?.parts || []).map(x => x.text || "").join("");
  }),
  groq: env => env.GROQ_API_KEY && openai("https://api.groq.com/openai/v1/chat/completions", env.GROQ_API_KEY, env.GROQ_MODEL || "llama-3.3-70b-versatile"),
  openrouter: env => env.OPENROUTER_API_KEY && openai("https://openrouter.ai/api/v1/chat/completions", env.OPENROUTER_API_KEY, env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free"),
  anthropic: env => env.ANTHROPIC_API_KEY && (async ({ system, user, search }) => {
    const j = await post("https://api.anthropic.com/v1/messages", { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" }, { model: env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 8000, system, ...(search ? { tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }] } : {}), messages: [{ role: "user", content: user }] });
    return (j.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  })
};
export const activeProviders = env => (env.AI_PROVIDERS || "gemini,groq,openrouter,anthropic").split(",").map(x => x.trim().toLowerCase()).filter(n => PROVIDERS[n] && PROVIDERS[n](env));

const FORMAT = `\n\nReturn ONLY one JSON object (no markdown fences, no commentary) with exactly these keys: ${Object.entries(POST_TOOL.input_schema.properties).map(([k, v]) => `"${k}" (${v.description})`).join("; ")}. The "content" value is the Markdown article as a single JSON string with \\n for line breaks.`;
const parseJson = t => { const m = String(t || "").replace(/^```(?:json)?\s*|\s*```$/g, "").trim(); const a = m.indexOf("{"), z = m.lastIndexOf("}"); return JSON.parse(a >= 0 ? m.slice(a, z + 1) : m); };

// Tries each available provider until one returns a usable post. Returns { post, provider }.
async function generate(env, system, user, log) {
  const names = activeProviders(env); if (!names.length) throw new Error("No AI key is set in Netlify. Add GEMINI_API_KEY (free) and/or GROQ_API_KEY (free). See README section 12.");
  const errors = [];
  for (const n of names) {
    try { const text = await PROVIDERS[n](env)({ system, user: user + FORMAT, json: true }); return { post: parseJson(text), provider: n }; }
    catch (err) { errors.push(`${n}: ${err.message}`); log && console.warn("provider failed", n, err.message); }
  }
  throw new Error("Every AI provider failed. " + errors.join(" | "));
}

// Optional step for "AI news" style topics: look up what is actually new (Gemini or Claude can search the web).
async function research(env, pillar) {
  for (const n of ["gemini", "anthropic"]) {
    try { if (!activeProviders(env).includes(n)) continue; const t = await PROVIDERS[n](env)({ system: "You are a careful research assistant. Be factual and brief.", user: researchPrompt(pillar), search: true }); if (t) return t.trim().slice(0, 6000); } catch (err) { console.warn("research skipped:", n, err.message); }
  }
  return "";
}

export async function writeOnePost({ env, db, source = "manual", slot = 0 }) {
  const settingsRef = db.doc("private/blogwriter"), memRef = db.doc("private/blogmemory");
  const settings = { ...DEFAULT_WRITER, ...((await settingsRef.get()).data() || {}) };
  if (source === "cron") {
    if (!settings.enabled) return { skipped: "The AI writer is switched off in Admin." };
    if (slot >= Number(settings.postsPerDay || 2)) return { skipped: `Only ${settings.postsPerDay} post(s) a day are wanted.` };
  }
  // Lock so two runs can never write at the same time.
  const locked = await db.runTransaction(async t => {
    const m = (await t.get(memRef)).data() || {};
    if (m.runningAt && Date.now() - m.runningAt < 10 * 60 * 1000) return false;
    t.set(memRef, { runningAt: Date.now(), lastStatus: "writing", lastError: "" }, { merge: true }); return true;
  });
  if (!locked) return { skipped: "Another run is already in progress." };

  try {
    const memory = (await memRef.get()).data() || {};
    const d = mergeData(SEED, await loadRaw().catch(() => ({})));
    const all = (await db.collection("posts").get()).docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    const recentTitles = [...new Set([...(memory.recent || []).map(r => r.title), ...all.slice(0, 40).map(p => p.title)])].filter(Boolean).slice(0, 60);
    const samples = all.filter(p => p.content && String(p.content).length > 800).slice(0, 3);
    const pillar = pickPillar(settings.pillars, memory);
    const brief = RESEARCH_PILLAR.test(pillar) ? await research(env, pillar) : "";

    const gen = await generate(env, systemPrompt(), userPrompt({ today: lagosToday(), pillar, settings, memory, samples, recentTitles, agency: agencyFacts(d), research: brief }), true);
    const p = checkPost(gen.post, { siteName: d.settings.name });

    let slug = p.slug, n = 2; const taken = new Set(all.map(x => x.slug));
    while (taken.has(slug)) slug = `${p.slug}-${n++}`;
    const date = lagosToday(), publish = !!settings.autoPublish;
    const doc = { title: p.title, slug, published: publish, date, category: p.category || "Insights", author: settings.author || d.settings.name, excerpt: p.excerpt, coverImage: "", gallery: [], coverAlt: p.coverAlt || p.title, imageIdea: p.imageIdea || "", content: p.content, waMessage: "", metaTitle: p.metaTitle || "", metaDescription: p.metaDescription || "", updatedAt: date, aiWritten: true, question: p.question };
    const ref = await db.collection("posts").add(doc);

    const recent = [{ title: p.title, slug, question: p.question, pillar, angle: p.angle, date }, ...(memory.recent || [])].slice(0, 60);
    await memRef.set({ recent, styleNotes: String(p.styleNotes || memory.styleNotes || "").slice(0, 1200), lastRunAt: Date.now(), lastStatus: "ok", lastError: "", lastPostId: ref.id, lastPostTitle: p.title, lastPostPublished: publish, lastProvider: gen.provider, runningAt: 0 }, { merge: true });

    if (publish) { const hook = ((await db.doc("private/config").get()).data() || {}).buildHook; if (/^https:\/\/api\.netlify\.com\/build_hooks\//.test(hook || "")) await fetch(hook, { method: "POST" }).catch(() => {}); }
    console.log(`blog-writer: saved "${p.title}" as ${publish ? "published" : "draft"} (${source}, via ${gen.provider})`);
    return { ok: true, title: p.title, published: publish, id: ref.id };
  } catch (err) {
    console.error("blog-writer failed:", err);
    await memRef.set({ lastStatus: "error", lastError: String(err.message || err).slice(0, 500), lastRunAt: Date.now(), runningAt: 0 }, { merge: true }).catch(() => {});
    return { ok: false, error: String(err.message || err) };
  }
}

export default async (req) => {
  const env = process.env, url = new URL(req.url);
  if (req.method !== "POST") return new Response("method", { status: 405 });
  try {
    const fromCron = req.headers.get("x-blog-secret") && req.headers.get("x-blog-secret") === secretFor(env);
    const admin_ = fromCron ? "cron" : await verifyAdminToken((req.headers.get("authorization") || "").replace(/^Bearer\s+/i, ""), env, fetch);
    if (!admin_) return new Response("not allowed", { status: 401 });
    const db = getDb(env), res = await writeOnePost({ env, db, source: fromCron ? "cron" : "manual", slot: Number(url.searchParams.get("slot") || 0) });
    console.log("blog-writer result", JSON.stringify(res));
  } catch (err) { console.error("blog-writer fatal:", err.message); }
  return new Response("done");
};
