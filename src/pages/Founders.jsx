import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { mdToHtml } from "../lib/md.js";

export default function Founders() {
  const { founders } = useContent();
  return <>
    <section className="sl-page-hero sl-container"><span className="sl-eyebrow">THE PEOPLE BEHIND THE WORK</span><h1>Built with a bias toward <em>doing.</em></h1></section>
    {founders.map(f => <section className="sl-section sl-container sl-founder" id={f.id} key={f.id}>
      <div className="sl-founder-photo">{f.photo ? <img src={f.photo} alt={f.photoAlt || `${f.name}, ${f.role}`} loading="lazy" /> : <div className="sl-founder-art"><strong>SL</strong><span>SMART LEAD SYSTEMS</span></div>}</div>
      <div><span className="sl-eyebrow">{(f.role || "Founder").toUpperCase()}</span><h2>{f.name}</h2>
        <div className="sl-founder-bio" dangerouslySetInnerHTML={{ __html: mdToHtml(f.bio) }} />
        <div className="sl-actions">{[["LinkedIn", f.linkedin], ["X", f.x], ["Instagram", f.instagram]].filter(([, u]) => /^https?:/i.test(u || "")).map(([n, u]) => <a className="sl-link" key={n} href={u} target="_blank" rel="noopener noreferrer me">{n} <ArrowUpRight size={14} /></a>)}<Link className="sl-btn" to="/contact">Work with Smart Lead <ArrowUpRight size={17} /></Link></div></div>
    </section>)}
  </>;
}
