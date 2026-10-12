import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Media, { MediaGrid } from "../components/Media";
import ShareBox from "../components/ShareBox";
import NotFound from "./NotFound";
import { useContent } from "../hooks/useContent";
import { mdToHtml, readingMinutes } from "../lib/md.js";
import { waLink, waMsg } from "../lib/links";
import { trackContact } from "../lib/track";

export default function Post() {
  const { slug } = useParams(), { posts, settings: s } = useContent(), p = posts.find(x => x.slug === slug);
  if (!p) return <NotFound />;
  const related = posts.filter(x => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
  const wa = waLink(s, waMsg(s, "post", p)), url = String(s.url || "").replace(/\/$/, "") + "/blog/" + p.slug;
  return <article className="sl-article sl-container">
    <Link className="sl-back" to="/blog"><ArrowLeft size={15} /> Back to insights</Link>
    <span className="sl-eyebrow">{p.category} · {p.date} · {p.content ? readingMinutes(p.content) : 1} min read</span>
    <h1>{p.title}</h1><p className="sl-article-lead">{p.excerpt}</p>
    <ShareBox url={url} title={p.title} text={p.excerpt} />
    {p.coverImage && <Media src={p.coverImage} alt={p.coverAlt || p.title} />}
    {p.content ? <div className="sl-article-body" dangerouslySetInnerHTML={{ __html: mdToHtml(p.content) }} /> : <div className="sl-article-body"><p>Loading article…</p></div>}
    {(p.gallery || []).length > 0 && <section className="sl-article-gallery"><h2>Gallery</h2><MediaGrid items={p.gallery} alt={p.title} /></section>}
    <ShareBox url={url} title={p.title} text={p.excerpt} />
    <aside className="sl-article-cta"><h2>Want help applying this to your business?</h2><p>Send us a quick message about what you're working on. We'll tell you the most useful next step.</p>
      <div className="sl-actions"><a className="sl-btn" href={wa} target="_blank" rel="noreferrer" onClick={trackContact}>Message us on WhatsApp <ArrowUpRight size={16} /></a><Link className="sl-link" to="/contact">Or use the contact form <ArrowUpRight size={15} /></Link></div></aside>
    <div className="sl-article-end"><span>By {p.author || s.name}</span><Link className="sl-link" to="/pricing">See pricing <ArrowUpRight size={15} /></Link></div>
    {related.length > 0 && <section className="sl-related"><h2>Keep reading</h2><div className="sl-insights">{related.map(x => <Link className="sl-insight" to={"/blog/" + x.slug} key={x.id}><Media src={x.coverImage} alt={x.coverAlt || x.title} /><span>{x.category} · {x.date}</span><h3>{x.title}</h3></Link>)}</div></section>}
  </article>;
}
