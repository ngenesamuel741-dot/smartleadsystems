import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Media from "../components/Media";
import { useContent } from "../hooks/useContent";

export default function Blog() {
  const { posts } = useContent(), [c, setC] = useState("All"), cats = ["All", ...new Set(posts.map(p => p.category).filter(Boolean))], list = c === "All" ? posts : posts.filter(p => p.category === c);
  return <>
    <section className="sl-page-hero sl-container"><span className="sl-eyebrow">THE JOURNAL</span><h1>Useful thinking for <em>growing businesses.</em></h1><p>Practical notes on building digital products, getting attention and turning good ideas into stronger businesses.</p></section>
    <section className="sl-section sl-container">
      {cats.length > 2 && <div className="sl-filters">{cats.map(x => <button className={c === x ? "selected" : ""} onClick={() => setC(x)} key={x}>{x}</button>)}</div>}
      <div className="sl-insights sl-blog">{list.map(p => <Link className="sl-insight" to={"/blog/" + p.slug} key={p.id}><Media src={p.coverImage} alt={p.coverAlt || p.title} /><span>{p.category} · {p.date}</span><h2>{p.title}</h2><p>{p.excerpt}</p><b>Read article <ArrowUpRight size={15} /></b></Link>)}</div>
      {!list.length && <p>No articles yet. Check back soon.</p>}
    </section>
  </>;
}
