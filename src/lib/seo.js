import { stripMd, readingMinutes } from "./md.js";
import { ogImage } from "./media.js";

export const STATIC_ROUTES = ["/", "/services", "/pricing", "/work", "/blog", "/founders", "/contact", "/privacy", "/terms"];
export const normPath = p => { let s = String(p || "/").split("?")[0].split("#")[0]; try { s = decodeURI(s); } catch (e) { /* keep as is */ } if (!s.startsWith("/")) s = "/" + s; return s.length > 1 ? s.replace(/\/+$/, "") : "/"; };
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; };
export const abs = (d, p) => d.settings.url.replace(/\/$/, "") + p;
export const fullTitle = (d, t) => t ? `${t} | ${d.settings.name}` : `${d.settings.name} | ${d.settings.tagline}`;
const crumbs = (d, items) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(d, path) })) });

function orgLd(d) {
  const s = d.settings, same = ["instagram", "linkedin", "x", "facebook", "tiktok", "youtube"].map(k => s[k]).filter(u => /^https?:/i.test(u || ""));
  return [
    { "@type": "Organization", "@id": abs(d, "/#org"), name: s.name, url: s.url, logo: s.logoUrl || abs(d, "/logo-512.png"), email: s.email, telephone: s.whatsapp, sameAs: same, areaServed: ["NG", "GB", "US"], address: { "@type": "PostalAddress", addressLocality: s.location }, founder: d.founders[0] ? { "@id": abs(d, "/founders#" + d.founders[0].id) } : undefined },
    { "@type": "WebSite", "@id": abs(d, "/#website"), url: s.url, name: s.name, description: s.siteDescription, publisher: { "@id": abs(d, "/#org") } }
  ];
}
const faqLd = d => d.faqs.length ? [{ "@type": "FAQPage", mainEntity: d.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : [];

export function resolveRoute(pathname, d) {
  const path = normPath(pathname), s = d.settings;
  const base = { path, status: 200, kind: "page", image: ogImage(s.ogImage) || abs(d, "/og-default.png"), type: "website", noindex: false };
  const mk = (kind, title, description, extra = {}, ld = []) => ({ ...base, kind, ...extra, seo: { ...base, ...extra, title: fullTitle(d, title), description: clip(description, 158) }, jsonld: ld.length ? { "@context": "https://schema.org", "@graph": ld } : null });
  const svcNames = d.services.map(x => x.title).join(", ");

  if (path === "/") return mk("home", "", s.siteDescription, {}, [...orgLd(d), { "@type": "ProfessionalService", name: s.name, url: s.url, description: s.siteDescription, serviceType: d.services.map(x => x.title), areaServed: ["Nigeria", "United Kingdom", "United States"], parent: { "@id": abs(d, "/#org") } }, ...faqLd(d)]);
  if (path === "/services") return mk("services", "Digital Growth Services", `Explore ${s.name} services: ${svcNames}.`, {}, [...orgLd(d), crumbs(d, [["Home", "/"], ["Services", "/services"]]), { "@type": "ItemList", itemListElement: d.services.map((x, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Service", name: x.title, description: x.description, provider: { "@id": abs(d, "/#org") } } })) }]);
  if (path === "/pricing") return mk("pricing", "Pricing", s.pricingNote ? `${s.pricingTitle} ${s.pricingNote}` : "Pricing for websites, ads and full-stack digital growth.", {}, [crumbs(d, [["Home", "/"], ["Pricing", "/pricing"]]), ...faqLd(d)]);
  if (path === "/work") return mk("work", "Selected Work", "Selected website, mobile app, ads, graphics and video projects from " + s.name + ".", {}, [crumbs(d, [["Home", "/"], ["Work", "/work"]])]);
  if (path === "/blog") return mk("blog", "Insights & Guides", "Practical guides on websites, mobile apps, Meta and Google Ads, creative, AI automation and growing an e-commerce or fintech business online.", {}, [crumbs(d, [["Home", "/"], ["Insights", "/blog"]]), { "@type": "Blog", name: s.name + " Insights", url: abs(d, "/blog"), blogPost: d.posts.slice(0, 20).map(p => ({ "@type": "BlogPosting", headline: p.title, url: abs(d, "/blog/" + p.slug), datePublished: p.date })) }]);
  if (path === "/founders") { const f = d.founders[0]; return mk("founders", f ? f.name + ", Founder" : "Founder", f ? clip(stripMd(f.bio), 158) : "Meet the founder behind " + s.name + ".", f && f.photo ? { image: ogImage(f.photo) } : {}, [...d.founders.map(x => ({ "@type": "Person", "@id": abs(d, "/founders#" + x.id), name: x.name, jobTitle: x.role, image: x.photo ? ogImage(x.photo) : undefined, description: clip(stripMd(x.bio), 300), url: abs(d, "/founders"), worksFor: { "@id": abs(d, "/#org") }, sameAs: [x.linkedin, x.x, x.instagram].filter(u => /^https?:/i.test(u || "")) })), crumbs(d, [["Home", "/"], ["Founder", "/founders"]])]); }
  if (path === "/contact") return mk("contact", "Contact", `Contact ${s.name} about website development, mobile apps, ads, graphics, video, AI automation or social media. Email ${s.email} or message us on WhatsApp.`, {}, [{ "@type": "ContactPage", name: "Contact " + s.name, url: abs(d, "/contact") }, crumbs(d, [["Home", "/"], ["Contact", "/contact"]])]);

  if (path === "/thank-you") return mk("thanks", "Thank you", s.thanksText, { noindex: true });
  if (path === "/thank-you-info") return mk("thanks2", "Thank you", s.unqualText, { noindex: true });

  const legal = d.pages.find(p => "/" + p.id === path);
  if (legal && (path === "/privacy" || path === "/terms")) return mk("legal", legal.title, legal.title + " for " + s.name + ".", { legal }, [crumbs(d, [["Home", "/"], [legal.title, path]])]);

  const m = path.match(/^\/blog\/([^/]+)$/);
  if (m) {
    const post = d.posts.find(p => p.slug === m[1]);
    if (post) {
      const desc = post.metaDescription || post.excerpt || stripMd(post.content).slice(0, 200), f = d.founders[0];
      const img = ogImage(post.coverImage) || base.image;
      return mk("post", post.metaTitle || post.title, desc, { post, type: "article", image: img, published: post.date, modified: post.updatedAt || post.date }, [
        { "@type": "BlogPosting", headline: post.title, description: clip(desc, 200), image: [img], datePublished: post.date, dateModified: post.updatedAt || post.date, mainEntityOfPage: abs(d, path), url: abs(d, path), articleSection: post.category, wordCount: stripMd(post.content).split(/\s+/).filter(Boolean).length, timeRequired: "PT" + readingMinutes(post.content) + "M", author: f ? { "@type": "Person", name: post.author && post.author !== s.name ? post.author : f.name, url: abs(d, "/founders") } : { "@type": "Organization", name: s.name }, publisher: { "@type": "Organization", name: s.name, url: s.url, logo: { "@type": "ImageObject", url: s.logoUrl || abs(d, "/logo-512.png") } } },
        crumbs(d, [["Home", "/"], ["Insights", "/blog"], [post.title, path]])
      ]);
    }
  }
  return { ...base, kind: "notfound", status: 404, noindex: true, jsonld: null, seo: { ...base, noindex: true, title: fullTitle(d, "Page not found"), description: "This page could not be found." } };
}
