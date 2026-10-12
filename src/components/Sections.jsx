import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import Media from "./Media";
import { useContent } from "../hooks/useContent";
import { waLink, waMsg } from "../lib/links";
import { trackContact } from "../lib/track";
import { cdn } from "../lib/media.js";

export function PricingGrid({ plans }) {
  const { settings: s } = useContent();
  return <div className="sl-pricing">{plans.map(p => <article key={p.id} className={"sl-plan" + (p.highlight ? " sl-plan-hot" : "")}>
    {p.highlight && <span className="sl-plan-tag">MOST POPULAR</span>}
    <h3>{p.title}</h3><div className="sl-price"><strong>{p.price}</strong><span>{p.period}</span></div>
    <p>{p.description}</p>
    <ul>{p.features.map(f => <li key={f}><Check size={15} />{f}</li>)}</ul>
    <Link className={p.highlight ? "sl-btn" : "sl-btn sl-btn-outline"} to={"/contact?plan=" + encodeURIComponent(p.title)}>{p.cta || "Get a quote"} <ArrowUpRight size={15} /></Link>
    <a className="sl-wa" href={waLink(s, waMsg(s, "plan", p))} target="_blank" rel="noreferrer" onClick={trackContact}>or chat on WhatsApp</a>
  </article>)}</div>;
}

export function FaqList({ faqs }) {
  return <div className="sl-faq">{faqs.map(f => <details key={f.id}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div>;
}

export function Testimonials({ items }) {
  if (!items.length) return null;
  return <div className="sl-testimonials">{items.map(t => <figure key={t.id}><blockquote>“{t.quote}”</blockquote><figcaption>{t.photo && <img src={cdn(t.photo, { w: 120 })} alt={t.name} loading="lazy" />}<div><strong>{t.name}</strong><span>{[t.role, t.company].filter(Boolean).join(" · ")}</span></div></figcaption></figure>)}</div>;
}

export function Clients({ items }) {
  if (!items.length) return null;
  return <div className="sl-clients">{items.map(c => c.logo ? <img key={c.id} src={cdn(c.logo, { w: 300 })} alt={c.name} loading="lazy" /> : <span key={c.id}>{c.name}</span>)}</div>;
}

export function Industries({ items }) {
  return <div className="sl-industries">{items.map(i => <article key={i.id}><h3>{i.title}</h3><p>{i.description}</p><ul>{i.points.map(x => <li key={x}><Check size={14} />{x}</li>)}</ul></article>)}</div>;
}

export { Media };
