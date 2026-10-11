import { Link, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useContent } from "../hooks/useContent";
import { resolveRoute } from "../lib/seo.js";
import { waLink, socials } from "../lib/links";
import { trackContact } from "../lib/track";
import SEO from "./SEO";
import Consent from "./Consent";

const NAV = [["/services", "Services"], ["/work", "Work"], ["/pricing", "Pricing"], ["/blog", "Insights"], ["/contact", "Contact"]];

export default function Layout() {
  const loc = useLocation(), data = useContent(), s = data.settings, [open, setOpen] = useState(false);
  const route = resolveRoute(loc.pathname, data), wa = waLink(s), logo = s.logoUrl || import.meta.env.BASE_URL + "logo.svg";
  useEffect(() => {
    setOpen(false);
    if (loc.hash) { const el = document.getElementById(loc.hash.slice(1)); if (el) { el.scrollIntoView(); return; } }
    window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash]);
  return <div className="sl-shell">
    <SEO seo={route.seo} url={s.url} />
    <header className="sl-header">
      <Link className="sl-logo" to="/"><img src={logo} alt={s.name} /></Link>
      <nav className={open ? "sl-nav sl-nav-open" : "sl-nav"} aria-label="Main">
        {NAV.map(([p, l]) => <Link className={loc.pathname.startsWith(p) ? "sl-active" : ""} to={p} key={p}>{l}</Link>)}
      </nav>
      <div className="sl-head-actions">
        <a className="sl-btn sl-btn-small" href={wa} target="_blank" rel="noreferrer" onClick={trackContact}>Start a project <ArrowUpRight size={15} /></a>
        <button className="sl-menu" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
    <main><Outlet /></main>
    <footer className="sl-footer">
      <div className="sl-container sl-footer-cta">
        <div><span className="sl-eyebrow sl-light">{s.name.toUpperCase()}</span><h2>{s.ctaTitle} {s.ctaAccent}</h2></div>
        <a className="sl-btn sl-btn-light" href={wa} target="_blank" rel="noreferrer" onClick={trackContact}>Talk to us <ArrowUpRight size={17} /></a>
      </div>
      <div className="sl-container sl-footer-grid">
        <div className="sl-footer-brand">
          <img src={logo} alt={s.name} /><p>{s.footerText}</p>
          <a href={"mailto:" + s.email}>{s.email}</a>
          <a href={wa} target="_blank" rel="noreferrer">WhatsApp · {s.whatsapp}</a>
          {socials(s).length > 0 && <div className="sl-socials">{socials(s).map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer me">{n}</a>)}</div>}
        </div>
        <div><span>Explore</span>{NAV.map(([p, l]) => <Link key={p} to={p}>{l}</Link>)}</div>
        <div><span>Company</span><Link to="/founders">Founder</Link><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div>
      </div>
      <div className="sl-container sl-copy"><span>© {new Date().getFullYear()} {s.name}. All rights reserved.</span><span>{s.location} · Serving ambitious businesses</span></div>
    </footer>
    <Consent />
  </div>;
}
