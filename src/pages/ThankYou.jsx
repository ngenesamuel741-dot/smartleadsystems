import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { waLink } from "../lib/links";
import { trackContact } from "../lib/track";

// qualified = true: "we'll reach out within 24 hours". qualified = false: the not-a-fit page. Both are editable in Site settings.
export default function ThankYou({ qualified = true }) {
  const { settings: s, posts } = useContent(), { state } = useLocation(), first = state && state.name ? String(state.name).trim().split(" ")[0] : "";
  const btnLink = s.unqualButtonLink || "/blog", internal = btnLink.startsWith("/");
  return <section className="sl-thanks sl-container">
    <div className="sl-thanks-mark"><Check size={30} /></div>
    <span className="sl-eyebrow">{qualified ? "MESSAGE RECEIVED" : "THANK YOU"}</span>
    {qualified ? <>
      <h1>{first ? `Thank you, ${first}.` : s.thanksTitle}</h1><p className="sl-thanks-lead">{s.thanksText}</p>
      <ol className="sl-thanks-steps"><li><b>01</b><span>We read your message and review what you need.</span></li><li><b>02</b><span>One of our team reaches out within 24 hours by email or WhatsApp.</span></li><li><b>03</b><span>We agree the right next step and a clear quote.</span></li></ol>
      <div className="sl-actions"><a className="sl-btn" href={waLink(s)} target="_blank" rel="noreferrer" onClick={trackContact}>Message us on WhatsApp <ArrowUpRight size={16} /></a><Link className="sl-link" to="/">Back to home <ArrowUpRight size={15} /></Link></div>
    </> : <>
      <h1>{s.unqualTitle}</h1><p className="sl-thanks-lead">{s.unqualText}</p>
      <div className="sl-actions" style={{ marginTop: 30 }}>{internal ? <Link className="sl-btn" to={btnLink}>{s.unqualButtonText || "Read our guides"} <ArrowUpRight size={16} /></Link> : <a className="sl-btn" href={btnLink} target="_blank" rel="noopener noreferrer">{s.unqualButtonText || "Learn more"} <ArrowUpRight size={16} /></a>}<Link className="sl-link" to="/">Back to home <ArrowUpRight size={15} /></Link></div>
    </>}
    {posts.length > 0 && <div className="sl-notfound-posts"><span className="sl-eyebrow">{qualified ? "WHILE YOU WAIT" : "HELPFUL READING"}</span>{posts.slice(0, 3).map(p => <Link key={p.id} to={"/blog/" + p.slug}>{p.title}</Link>)}</div>}
  </section>;
}
