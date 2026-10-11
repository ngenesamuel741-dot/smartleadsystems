import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Media from "../components/Media";
import { Clients, Testimonials } from "../components/Sections";
import { useContent } from "../hooks/useContent";

export default function Work() {
  const { projects, clients, testimonials } = useContent(), [c, setC] = useState("All");
  const cats = ["All", ...new Set(projects.map(p => p.category))], list = c === "All" ? projects : projects.filter(p => p.category === c);
  return <>
    <section className="sl-page-hero sl-container"><span className="sl-eyebrow">SELECTED WORK</span><h1>Good work should <em>show itself.</em></h1><p>A selection of digital products, campaigns and creative directions. No inflated numbers. Just the work.</p></section>
    <section className="sl-section sl-container">
      <div className="sl-filters">{cats.map(x => <button className={c === x ? "selected" : ""} onClick={() => setC(x)} key={x}>{x}</button>)}</div>
      <div className="sl-portfolio">{list.map(p => <article key={p.id}><Media src={p.image} alt={p.title} /><div><span>{p.category}</span><h2>{p.title}</h2><p>{p.summary}</p>
        {p.link && /^https?:/i.test(p.link) && <a className="sl-link" href={p.link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={15} /></a>}{" "}
        <Link className="sl-link" to={"/contact?service=" + encodeURIComponent(p.category)}>Talk about a similar project <ArrowUpRight size={15} /></Link></div></article>)}</div>
    </section>
    {testimonials.length > 0 && <section className="sl-section sl-white"><div className="sl-container"><Testimonials items={testimonials} /></div></section>}
    {clients.length > 0 && <section className="sl-section sl-container"><div className="sl-kicker"><span>CLIENTS</span><span></span></div><Clients items={clients} /></section>}
  </>;
}
