import { useEffect, useSyncExternalStore } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { SEED } from "../content/seed";
import { COLS, mergeData } from "../lib/data.js";

// One shared store: starts from content the server already embedded (instant), then refreshes from Firestore.
let state = mergeData(SEED, typeof window !== "undefined" ? window.__SL__ : null);
let started = false;
const listeners = new Set();

async function refresh() {
  if (!db) return;
  try {
    const raw = {};
    const [s, ...rest] = await Promise.all([getDoc(doc(db, "settings", "site")), ...COLS.map(c => getDocs(collection(db, c)))]);
    if (s.exists()) raw.settings = s.data();
    COLS.forEach((c, i) => { raw[c] = rest[i].docs.map(x => ({ id: x.id, ...x.data() })); });
    state = mergeData(SEED, raw);
    listeners.forEach(l => l());
  } catch (err) { console.warn("Using built-in content:", err.message); }
}

export function useContent() {
  useEffect(() => { if (!started) { started = true; refresh(); } }, []);
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);
}
