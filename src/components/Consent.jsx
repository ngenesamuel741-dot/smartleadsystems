import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import { getConsent, setConsent, initTracking, pageview } from "../lib/track";

export default function Consent() {
  const { settings } = useContent(), loc = useLocation();
  const [c, setC] = useState(getConsent());
  const always = settings.trackWithoutConsent === true, has = !!(settings.gaId || settings.metaPixelId || settings.tiktokPixelId);
  useEffect(() => { const h = () => setC(getConsent()); window.addEventListener("sl-consent", h); return () => window.removeEventListener("sl-consent", h); }, []);
  useEffect(() => { if ((c === "yes" || always) && has) initTracking(settings.gaId, settings.metaPixelId, settings.tiktokPixelId); }, [c, always, has, settings.gaId, settings.metaPixelId, settings.tiktokPixelId]);
  useEffect(() => { if ((c === "yes" || always) && has) pageview(loc.pathname); }, [loc.pathname, c, always, has]);
  if (!has || c || always) return null;
  return <div className="sl-consent" role="dialog" aria-label="Cookie consent"><p>We use cookies for analytics and to measure our ads (Google, Meta, TikTok). Accept to help us improve the site. See our <a href="/privacy">Privacy Policy</a>.</p><div><button className="sl-btn sl-btn-small" onClick={() => setConsent("yes")}>Accept</button><button className="sl-btn sl-btn-small sl-btn-ghost" onClick={() => setConsent("no")}>Decline</button></div></div>;
}
