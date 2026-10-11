import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../hooks/useContent";

export default function NotFound() {
  const { posts } = useContent();
  return <section className="sl-page-hero sl-container"><span className="sl-eyebrow">404 · PAGE NOT FOUND</span><h1>That page <em>doesn't exist.</em></h1><p>The link may be old or mistyped. Head back home, or have a look at our latest articles below.</p>
    <div className="sl-actions"><Link className="sl-btn" to="/">Back to home <ArrowUpRight size={17} /></Link><Link className="sl-link" to="/contact">Contact us <ArrowUpRight size={16} /></Link></div>
    {posts.length > 0 && <div className="sl-notfound-posts"><span className="sl-eyebrow">LATEST ARTICLES</span>{posts.slice(0, 3).map(p => <Link key={p.id} to={"/blog/" + p.slug}>{p.title}</Link>)}</div>}</section>;
}
