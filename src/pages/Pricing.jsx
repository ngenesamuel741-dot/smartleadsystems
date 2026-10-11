import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PricingGrid, FaqList } from "../components/Sections";
import { useContent } from "../hooks/useContent";

export default function Pricing() {
  const { settings: s, pricing, faqs } = useContent();
  return <>
    <section className="sl-page-hero sl-pricing-hero sl-container"><span className="sl-eyebrow">PRICING</span><h1>{s.pricingTitle}</h1><p>{s.pricingNote}</p></section>
    <section className="sl-section sl-container">{pricing.length ? <PricingGrid plans={pricing} /> : <p>Contact us for a custom quote.</p>}
      <p className="sl-fine">Need something different? <Link className="sl-link" to="/contact">Ask for a custom quote <ArrowUpRight size={14} /></Link></p></section>
    {faqs.length > 0 && <section className="sl-section sl-white"><div className="sl-container sl-faq-wrap"><div><span className="sl-eyebrow">QUESTIONS</span><h2>Frequently asked questions.</h2></div><FaqList faqs={faqs} /></div></section>}
  </>;
}
