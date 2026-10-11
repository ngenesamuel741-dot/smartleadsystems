import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Megaphone, Palette, Bot } from "lucide-react";
import Media from "../components/Media";
import { PricingGrid, FaqList, Testimonials, Clients, Industries } from "../components/Sections";
import { useContent } from "../hooks/useContent";
import { serviceIcon } from "../lib/icons";
import { waLink } from "../lib/links";
import { trackContact } from "../lib/track";

export default function Home() {
  const { settings: s, services, projects, posts, pricing, faqs, process, industries, testimonials, clients } = useContent(), wa = waLink(s);
  return <>
    <section className="sl-hero sl-container"><div>
      <span className="sl-eyebrow">{s.heroEyebrow}</span>
      <h1>{s.heroLine1}<br /><em>{s.heroLine2}</em><br />{s.heroLine3}</h1>
      <p>{s.heroText}</p>
      <div className="sl-actions"><a className="sl-btn" href={wa} target="_blank" rel="noreferrer" onClick={trackContact}>{s.heroCta} <ArrowUpRight size={17} /></a><Link className="sl-link" to="/services">Explore what we do <ArrowUpRight size={16} /></Link></div>
      <div className="sl-note"><i></i><span>Websites · Apps · Ads · Creative · Automation · Social</span></div>
    </div>
    <div className="sl-hero-panel">
      <div className="sl-panel-top"><span>{s.name.toUpperCase()}</span><span>BUILD / REACH / GROW</span></div>
      <div className="sl-screen"><div className="sl-screen-bar"><b>SMART LEAD</b><i></i><i></i><i></i></div>
        <div className="sl-screen-grid"><div className="sl-screen-main"><small>DIGITAL GROWTH SYSTEM</small><strong>One partner.<br />Every digital layer.</strong><b></b><span>Development + Growth + Creative</span></div>
          <div className="sl-screen-stack">{[[Code2, "BUILD", "Web + Mobile"], [Megaphone, "REACH", "Meta + Google Ads"], [Palette, "CREATE", "Graphics + Video"], [Bot, "AUTOMATE", "AI Workflows"]].map(([I, t, x]) => <div key={t}><I /><strong>{t}</strong><span>{x}</span></div>)}</div></div></div>
      <div className="sl-panel-foot"><span>STRATEGY</span><span>DESIGN</span><span>TECH</span><span>GROWTH</span></div>
    </div></section>

    <section className="sl-strip"><div className="sl-container">{services.map(x => <span key={x.id}>{x.title}</span>)}</div></section>

    {clients.length > 0 && <section className="sl-section sl-container"><div className="sl-kicker"><span>TRUSTED BY</span><span></span></div><Clients items={clients} /></section>}

    <section className="sl-section sl-container"><div className="sl-kicker"><span>THE SMART LEAD APPROACH</span><span>01 — 03</span></div>
      <div className="sl-two"><h2>{s.approachTitle} <em>{s.approachAccent}</em></h2><div><p>{s.approachText1}</p><p>{s.approachText2}</p><Link className="sl-link" to="/services">See all services <ArrowUpRight size={16} /></Link></div></div></section>

    {industries.length > 0 && <section className="sl-section sl-white"><div className="sl-container"><div className="sl-section-head"><div><span className="sl-eyebrow">WHO WE HELP</span><h2>Built for e-commerce brands and fintech startups.</h2></div></div><Industries items={industries} /></div></section>}

    <section className="sl-section"><div className="sl-container"><div className="sl-section-head"><div><span className="sl-eyebrow">WHAT WE OFFER</span><h2>Everything your digital growth needs.</h2></div><Link className="sl-link" to="/services">View all services <ArrowUpRight size={16} /></Link></div>
      <div className="sl-service-grid">{services.map((x, i) => { const I = serviceIcon(x.id); return <article className="sl-service-card" key={x.id}><div className="sl-icon"><I size={21} /></div><span className="sl-number">0{i + 1}</span><h3>{x.title}</h3><p>{x.description}</p><div className="sl-tags">{x.capabilities.slice(0, 4).map(c => <span key={c}>{c}</span>)}</div><Link to={"/services#" + x.id}>Explore service <ArrowUpRight size={15} /></Link></article>; })}</div></div></section>

    <section className="sl-section sl-dark"><div className="sl-container"><div className="sl-section-head"><div><span className="sl-eyebrow sl-light">SELECTED WORK</span><h2>Built to be seen. Designed to work.</h2></div><Link className="sl-link sl-white-link" to="/work">See selected work <ArrowUpRight size={16} /></Link></div>
      <div className="sl-work-grid">{projects.slice(0, 4).map((p, i) => <Link className={"sl-work-card sl-work-" + i} to="/work" key={p.id}><Media src={p.image} alt={p.title} /><div><span>{p.category}</span><h3>{p.title}</h3><p>{p.summary}</p></div></Link>)}</div></div></section>

    <section className="sl-section sl-container"><div className="sl-kicker"><span>HOW WE WORK</span><span>0{process.length} STEPS</span></div>
      <div className="sl-process">{process.map((x, i) => <div key={x.id}><span>0{i + 1}</span><h3>{x.title}</h3><p>{x.description}</p></div>)}</div></section>

    {testimonials.length > 0 && <section className="sl-section sl-white"><div className="sl-container"><div className="sl-section-head"><div><span className="sl-eyebrow">CLIENT WORDS</span><h2>What clients say.</h2></div></div><Testimonials items={testimonials} /></div></section>}

    {pricing.length > 0 && <section className="sl-section sl-container"><div className="sl-section-head"><div><span className="sl-eyebrow">PRICING</span><h2>{s.pricingTitle}</h2></div><Link className="sl-link" to="/pricing">See pricing details <ArrowUpRight size={16} /></Link></div><PricingGrid plans={pricing} /><p className="sl-fine">{s.pricingNote}</p></section>}

    {faqs.length > 0 && <section className="sl-section sl-white"><div className="sl-container sl-faq-wrap"><div><span className="sl-eyebrow">QUESTIONS</span><h2>Frequently asked questions.</h2></div><FaqList faqs={faqs} /></div></section>}

    <section className="sl-cta-band"><div className="sl-container sl-two"><div><span className="sl-eyebrow">{s.ctaEyebrow}</span><h2>{s.ctaTitle}<br /><em>{s.ctaAccent}</em></h2></div><div><p>{s.ctaText}</p><a className="sl-btn" href={wa} target="_blank" rel="noreferrer" onClick={trackContact}>Message us on WhatsApp <ArrowUpRight size={17} /></a></div></div></section>

    {posts.length > 0 && <section className="sl-section sl-container"><div className="sl-section-head"><div><span className="sl-eyebrow">INSIGHTS</span><h2>Useful ideas for growing businesses.</h2></div><Link className="sl-link" to="/blog">Read the journal <ArrowUpRight size={16} /></Link></div>
      <div className="sl-insights">{posts.slice(0, 3).map(p => <Link className="sl-insight" to={"/blog/" + p.slug} key={p.id}><Media src={p.coverImage} alt={p.coverAlt || p.title} /><span>{p.category} · {p.date}</span><h3>{p.title}</h3><p>{p.excerpt}</p></Link>)}</div></section>}
  </>;
}
