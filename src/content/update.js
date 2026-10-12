// One-click content updates shown on the admin Overview. Each one touches only what it says and never your posts,
// pricing, projects, founder, photos or leads.
import { collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { SEED } from "./seed";

const SETTING_KEYS = ["heroEyebrow", "heroText", "siteDescription", "approachText1", "approachText2", "footerText", "ctaText"];

async function allBusinesses() {
  const b = writeBatch(db);
  for (const { id, ...data } of SEED.services) {          // keeps each service's photos/gallery
    const old = (await getDoc(doc(db, "services", id))).data() || {};
    b.set(doc(db, "services", id), { ...data, image: old.image || data.image, gallery: Array.isArray(old.gallery) ? old.gallery : [] });
  }
  for (const { id, ...data } of SEED.industries) b.set(doc(db, "industries", id), data);
  for (const { id, ...data } of SEED.faqs) b.set(doc(db, "faqs", id), data);
  const oldSettings = (await getDoc(doc(db, "settings", "site"))).data() || {};
  b.set(doc(db, "settings", "site"), { ...SEED.settings, ...oldSettings, ...Object.fromEntries(SETTING_KEYS.map(k => [k, SEED.settings[k]])) });
  await markApplied(b, "all-businesses-2026-10");
  await b.commit();
}

async function planQuestion() {
  const existing = (await getDocs(collection(db, "formfields"))).docs.map(d => ({ id: d.id, ...d.data() }));
  const b = writeBatch(db);
  if (!existing.some(f => f.key === "plan" || f.id === "plan")) {
    const { id, ...q } = SEED.formfields.find(f => f.id === "plan");
    const svc = existing.find(f => f.key === "service");
    b.set(doc(db, "formfields", id), { ...q, order: svc ? (Number(svc.order) || 5) + 0.5 : q.order });
  }
  await markApplied(b, "plan-question-2026-10");
  await b.commit();
}

async function markApplied(batch, id) {
  const cfg = (await getDoc(doc(db, "private", "config"))).data() || {};
  batch.set(doc(db, "private", "config"), { ...cfg, updates: [...new Set([...(cfg.updates || []), id])] });
}

export const UPDATES = [
  { id: "all-businesses-2026-10", title: "Serve every business", apply: allBusinesses, confirm: "Apply the update? It rewrites your services, Who-we-help list, FAQs and a few site-wide texts. Your posts, pricing, founder, photos and leads are not touched.",
    text: "Rewrites the site wording so it is for all businesses, puts Meta & Google Ads first, adds a CRM service, a 16-sector Who-we-help list and richer FAQs for Google and AI answers. Your posts, pricing, projects, founder, photos, lead form and leads stay as they are." },
  { id: "plan-question-2026-10", title: "Add a package question to the lead form", apply: planQuestion, confirm: "Add the 'Which package are you interested in?' question to your lead form?",
    text: "Adds a dropdown to the contact form where visitors pick a package. The choices come from your Pricing section automatically, so they stay up to date when you edit pricing." }
];

export async function pendingUpdates() {
  try { const c = (await getDoc(doc(db, "private", "config"))).data() || {}; return UPDATES.filter(u => !(c.updates || []).includes(u.id)); } catch (e) { return []; }
}
