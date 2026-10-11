import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useContent } from "../hooks/useContent";
import { waLink } from "../lib/links";
import { trackLead, trackContact, trackingContext } from "../lib/track";
import { getAttribution } from "../lib/attribution";
import { ensureCore, evaluate, validate, toLeadParts } from "../lib/leadform.js";

const SHORT = ["text", "email", "phone"];

function Question({ f, value, set, options }) {
  const common = { id: "q_" + f.key, value: value || "", onChange: e => set(f.key, e.target.value), required: !!f.required };
  if (f.type === "textarea") return <label className="sl-full">{f.label}{f.required ? " *" : ""}<textarea rows={5} placeholder={f.placeholder} {...common} /></label>;
  if (f.type === "select") return <label className="sl-full">{f.label}{f.required ? " *" : ""}<select {...common}><option value="">{f.placeholder || "Select an option"}</option>{options.map(o => <option key={o}>{o}</option>)}</select></label>;
  if (f.type === "radio") return <fieldset className="sl-full sl-radio"><legend>{f.label}{f.required ? " *" : ""}</legend>{options.map(o => <label key={o}><input type="radio" name={"q_" + f.key} checked={value === o} onChange={() => set(f.key, o)} />{o}</label>)}</fieldset>;
  if (f.type === "checkbox") return <label className="sl-full sl-check"><input type="checkbox" checked={value === "Yes"} onChange={e => set(f.key, e.target.checked ? "Yes" : "")} />{f.label}{f.required ? " *" : ""}</label>;
  return <label>{f.label}{f.required ? " *" : ""}<input type={f.type === "email" ? "email" : f.type === "phone" ? "tel" : "text"} placeholder={f.placeholder} autoComplete={f.key === "name" ? "name" : f.key === "email" ? "email" : f.key === "phone" ? "tel" : f.key === "company" ? "organization" : "off"} {...common} /></label>;
}

export default function Contact() {
  const { settings: s, services, formfields } = useContent(), [q] = useSearchParams(), wa = waLink(s), go = useNavigate();
  const fields = useMemo(() => ensureCore(formfields), [formfields]);
  const [v, setV] = useState(() => ({ service: q.get("service") || "", message: q.get("plan") ? `I'm interested in the ${q.get("plan")} package.\n\n` : "" }));
  const [hp, setHp] = useState(""), [sending, setSending] = useState(false), [err, setErr] = useState("");
  const set = (k, val) => setV(o => ({ ...o, [k]: val }));
  const optionsFor = f => f.options && f.options.length ? f.options : f.key === "service" ? [...services.map(x => x.title), "Other / not sure yet"] : [];

  async function submit(e) {
    e.preventDefault(); setErr("");
    if (hp) return go("/thank-you"); // honeypot: bots fill this hidden field
    const bad = validate(fields, v); if (bad) return setErr(bad);
    try { if (Date.now() - Number(localStorage.getItem("sl_last_lead") || 0) < 30000) return setErr("Please wait a moment before sending another message."); } catch (x) { /* ignore */ }
    const { qualified, reasons } = evaluate(fields, v), { top, answers } = toLeadParts(fields, v), at = getAttribution();
    setSending(true);
    try {
      if (!db) throw new Error("offline");
      const ref = await addDoc(collection(db, "leads"), { ...top, name: top.name.slice(0, 120), email: top.email.slice(0, 200), phone: top.phone.slice(0, 60), company: top.company.slice(0, 120), service: top.service.slice(0, 120), message: top.message.slice(0, 4000), plan: q.get("plan") || "", answers, qualified, qualReason: reasons.join("; ").slice(0, 400), source: (at.referrer || "direct").slice(0, 200), landing: (at.landing || "").slice(0, 200), attribution: at.params || {}, status: qualified ? "new" : "unqualified", createdAt: serverTimestamp() });
      try { localStorage.setItem("sl_last_lead", String(Date.now())); } catch (x) { /* ignore */ }
      // Email alert + server-side ad events (Meta Conversions API / TikTok Events API). The lead is already saved, so a failure here never loses it.
      fetch("/.netlify/functions/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: ref.id, values: v, tracking: trackingContext(), attr: { landing: at.landing, ...(at.params || {}) } }), keepalive: true }).catch(() => {});
      if (qualified) { trackLead(ref.id); go("/thank-you", { state: { name: top.name } }); } else go("/thank-you-info", { state: { name: top.name } });
    } catch (x) { setSending(false); setErr(`We couldn't send that just now. Please email ${s.email} or message us on WhatsApp.`); }
  }

  return <>
    <section className="sl-contact sl-container"><div>
      <span className="sl-eyebrow">LET'S WORK</span><h1>{s.contactTitle} <em>{s.contactAccent}</em></h1><p>{s.contactText}</p>
      <form className="sl-form" onSubmit={submit} noValidate>
        <div className="sl-fields">{fields.map(f => <Question key={f.key} f={f} value={v[f.key]} set={set} options={optionsFor(f)} />)}</div>
        <input className="sl-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={e => setHp(e.target.value)} />
        {err && <p className="sl-form-err" role="alert">{err}</p>}
        <button className="sl-btn" disabled={sending}>{sending ? "Sending…" : s.submitText || "Send message"} <ArrowUpRight size={16} /></button>
        {s.formNote && <p className="sl-fine">{s.formNote}</p>}
      </form>
    </div>
    <div className="sl-contact-cards"><a href={wa} target="_blank" rel="noreferrer" onClick={trackContact}><MessageCircle /><span>WHATSAPP</span><strong>{s.whatsapp}</strong><small>Send a message <ArrowUpRight size={14} /></small></a>
      <a href={"mailto:" + s.email}><Mail /><span>EMAIL</span><strong>{s.email}</strong><small>Send an email <ArrowUpRight size={14} /></small></a></div></section>
    <section className="sl-contact-services"><div className="sl-container"><span className="sl-eyebrow">WE CAN HELP WITH</span><div>{services.map((x, i) => <span key={x.id}><b>0{i + 1}</b>{x.title}</span>)}</div></div></section>
  </>;
}
