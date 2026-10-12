import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { MediaSet } from "../components/Media";
import { mdToHtml } from "../lib/md.js";
import { useContent } from "../hooks/useContent";
import { waLink, waMsg } from "../lib/links";
import { trackContact } from "../lib/track";
import { serviceIcon } from "../lib/icons";

export default function Services() {
  const { services, settings: s } = useContent();
  return <>
    <section className="sl-page-hero sl-container"><span className="sl-eyebrow">OUR SERVICES</span><h1>The digital work your business needs, <em>under one roof.</em></h1><p>Smart Lead Systems is a digital growth partner for businesses in every sector. We run Meta and Google Ads, build CRM and lead follow-up systems, and deliver the websites, apps, creative and automation that turn attention into customers.</p></section>
    <section className="sl-section sl-container">{services.map((x, i) => { const I = serviceIcon(x.id); return <article className="sl-detail" id={x.id} key={x.id}>
      <div><div className="sl-detail-top"><span>0{i + 1}</span><I size={23} /></div><span className="sl-eyebrow">{x.accent}</span><h2>{x.title}</h2><p>{x.description}</p>
        <div className="sl-tags sl-detail-tags">{x.capabilities.map(c => <span key={c}>{c}</span>)}</div>
        <div className="sl-actions"><a className="sl-btn sl-btn-small" href={waLink(s, waMsg(s, "service", x))} target="_blank" rel="noreferrer" onClick={trackContact}>Chat on WhatsApp <ArrowUpRight size={15} /></a><Link className="sl-link" to={"/contact?service=" + encodeURIComponent(x.title)}>Use the contact form <ArrowUpRight size={16} /></Link></div></div>
      <MediaSet items={[x.image, ...(x.gallery || [])]} alt={x.title} />{x.details && <div className="sl-details" dangerouslySetInnerHTML={{ __html: mdToHtml(x.details) }} />}</article>; })}</section>
    <section className="sl-section sl-dark"><div className="sl-container sl-narrow"><span className="sl-eyebrow sl-light">ONE TEAM. MANY CAPABILITIES.</span><h2>Build it. Make it look good. Get it seen. Keep it moving.</h2><p>That's the Smart Lead Systems approach: practical digital execution without the agency runaround.</p><Link className="sl-btn sl-btn-light" to="/contact">Start a project <ArrowUpRight size={17} /></Link></div></section>
  </>;
}
