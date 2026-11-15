// Plain HTML snapshot of each page. It is injected into the page so Google and AI crawlers that
// don't run JavaScript still get the full text, links and image alt text. React replaces it in the browser.
import { escapeHtml as e, mdToHtml, readingMinutes } from "./md.js";
import { abs } from "./seo.js";
import { cdn, isVideo } from "./media.js";
import { US_REGIONS, US_FAQS } from "../content/usa.js";

const a = (href, text) => `<a href="${e(href)}">${e(text)}</a>`;
const list = items => "<ul>" + items.map(x => `<li>${e(x)}</li>`).join("") + "</ul>";
const imgs = (arr, alt) => (arr || []).map((u, i) => img(u, `${alt} ${i + 1}`)).join("");
const img = (src, alt) => src && !isVideo(src) ? `<img src="${e(cdn(src, { w: 1200 }))}" alt="${e(alt)}" title="${e(alt)}" loading="lazy" decoding="async"/>` : "";

function chrome(d, inner) {
  const s = d.settings;
  const nav = [["/", "Home"], ["/services", "Services"], ["/work", "Work"], ["/pricing", "Pricing"], ["/blog", "Insights"], ["/contact", "Contact"]].map(([h, t]) => a(h, t)).join(" ");
  const foot = [["/founders", "Founder"], ["/usa", "USA service areas"], ["/privacy", "Privacy Policy"], ["/terms", "Terms of Service"]].map(([h, t]) => a(h, t)).join(" ");
  return `<header><a href="/">${e(s.name)}</a><nav>${nav}</nav></header><main>${inner}</main><footer><p>${e(s.footerText)}</p><p>${a("mailto:" + s.email, s.email)} · ${e(s.location)}</p><nav>${foot}</nav></footer>`;
}
const faqs = d => d.faqs.length ? `<section><h2>Frequently asked questions</h2>${d.faqs.map(f => `<h3>${e(f.question)}</h3><p>${e(f.answer)}</p>`).join("")}</section>` : "";
const plans = d => d.pricing.length ? `<section><h2>${e(d.settings.pricingTitle)}</h2>${d.pricing.map(p => `<article><h3>${e(p.title)}</h3><p><strong>${e(p.price)}</strong> ${e(p.period)}</p><p>${e(p.description)}</p>${list(p.features)}</article>`).join("")}<p>${e(d.settings.pricingNote)}</p></section>` : "";
const postList = posts => posts.map(p => `<article><h3>${a("/blog/" + p.slug, p.title)}</h3><p>${e(p.category)} · ${e(p.date)}</p><p>${e(p.excerpt)}</p></article>`).join("");

function usaHtml(d) {
  const guides = {
    "meta-ads": ["Businesses that need a measurable flow of enquiries, purchases or bookings from paid social and search.", "Campaign planning, Meta and Google campaign management, creative and audience testing, tracking setup, lead quality checks and performance reporting."],
    "crm-systems": ["Teams receiving leads from ads, websites, WhatsApp or multiple sales channels.", "Lead capture, sales pipelines, qualification, task assignment, reminders, email and WhatsApp workflows, integrations and reporting."],
    "web-development": ["Businesses that need a credible online presence, conversion-focused landing page, online store or custom web experience.", "Business websites, landing pages, e-commerce, responsive design, enquiry forms, integrations and technical SEO foundations."],
    "app-development": ["Founders and established businesses planning a customer app, internal tool or web application.", "Product discovery, user flows, interface design, mobile and web apps, authentication, dashboards, APIs and integrations."],
    "graphics-design": ["Brands that need consistent creative for campaigns, products, social channels and sales materials.", "Ad creatives, social graphics, campaign artwork, brand assets, promotional designs, carousels and marketing collateral."],
    "video-editing": ["Businesses and creators turning footage into useful organic and paid social content.", "Short-form edits, Reels, video ads, captions, subtitles, motion graphics, repurposing and platform-ready exports."],
    "ai-automation": ["Teams spending too much time on repetitive enquiries, administration, content processes or data handling.", "AI assistants, lead qualification, CRM workflows, notifications, data processing and integrations."],
    "social-media": ["Businesses that need a consistent publishing process and organised social presence.", "Content strategy, calendars, creative direction, publishing, community workflows and performance reviews."]
  };
  const services = d.services.map(s => { const g = guides[s.id] || ["Businesses looking for a practical digital partner.", (s.capabilities || []).join(", ")]; return "<article><h3>" + e(s.title) + "</h3><p>" + e(s.description) + "</p><h4>Who needs this</h4><p>" + e(g[0]) + "</p><h4>What it can include</h4><p>" + e(g[1]) + "</p><p>" + a("/contact?service=" + encodeURIComponent(s.title), "Enquire about " + s.title) + "</p></article>"; }).join("");
  const regions = US_REGIONS.map(r => "<section><h3>" + e(r.name) + " region</h3>" + r.states.map(state => "<article><h4>Digital marketing and development services in " + e(state) + "</h4><p>Businesses based in " + e(state) + " can enquire about remote Meta and Google Ads management, CRM and lead management, website and app development, graphics, video, AI automation and social media services from Smart Lead Systems.</p><p>" + a("/contact", "Discuss a project from " + state) + "</p></article>").join("") + "</section>").join("");
  const faqs = US_FAQS.map(f => "<h3>" + e(f.question) + "</h3><p>" + e(f.answer) + "</p>").join("");
  return "<h1>Digital growth services for businesses across all 50 US states</h1><p>Smart Lead Systems is a Lagos-based digital growth agency accepting remote project enquiries from businesses throughout the United States. We bring advertising, websites, apps, creative, CRM and automation together so your digital work supports one clear business goal.</p><p>We do not claim to have offices in every state. Projects are delivered remotely, with scope, availability, communication arrangements and timelines agreed before work begins.</p><p>" + a("/contact", "Tell us about your project") + " · " + a("/services", "Explore all services") + "</p><section><h2>Eight connected digital services</h2>" + services + "</section><section><h2>Remote service coverage across the four US Census regions</h2><p>These are remote service areas, not local office listings or claims of a physical presence.</p>" + regions + "<p><strong>Coverage note:</strong> The District of Columbia is not one of the 50 states. Businesses in Washington, DC may also submit a remote project enquiry.</p></section><section><h2>How to get started</h2><ol><li>Tell us about your business, location, goals and required service.</li><li>We review fit, scope, access, timeline and dependencies.</li><li>We agree on a proposed scope, pricing and next steps before work starts.</li><li>We deliver remotely with agreed communication, approvals and milestones.</li></ol><p>" + a("/contact", "Complete the project enquiry form") + "</p></section><section><h2>Frequently asked questions about USA coverage</h2>" + faqs + "</section><section><h2>Need a digital partner for your US business?</h2><p>Send your requirements through the Smart Lead Systems enquiry form.</p><p>" + a("/contact", "Contact Smart Lead Systems") + "</p></section>";
}
export function renderStatic(route, d) {
  const s = d.settings;
  let inner = "";
  switch (route.kind) {
    case "home":
      inner = `<h1>${e(s.heroLine1)} ${e(s.heroLine2)} ${e(s.heroLine3)}</h1><p>${e(s.heroText)}</p>` +
        `<section><h2>${e(s.approachTitle)} ${e(s.approachAccent)}</h2><p>${e(s.approachText1)}</p><p>${e(s.approachText2)}</p></section>` +
        (d.industries.length ? `<section><h2>Who we help: businesses in every sector</h2>${d.industries.map(i => `<article><h3>${e(i.title)}</h3><p>${e(i.description)}</p>${list(i.points)}</article>`).join("")}</section>` : "") +
        `<section><h2>Services</h2>${d.services.map(x => `<article><h3>${a("/services#" + x.id, x.title)}</h3><p>${e(x.description)}</p></article>`).join("")}</section>` +
        `<section><h2>How we work</h2><ol>${d.process.map(x => `<li><strong>${e(x.title)}</strong>: ${e(x.description)}</li>`).join("")}</ol></section>` +
        (d.testimonials.length ? `<section><h2>What clients say</h2>${d.testimonials.map(t => `<blockquote>${e(t.quote)}<footer>${e(t.name)}${t.role ? ", " + e(t.role) : ""}</footer></blockquote>`).join("")}</section>` : "") +
        plans(d) + faqs(d) + `<section><h2>Insights</h2>${postList(d.posts.slice(0, 6))}</section><section><h2>${e(s.ctaTitle)} ${e(s.ctaAccent)}</h2><p>${e(s.ctaText)}</p><p>${a("/contact", "Contact us")}</p><p>${a("/usa", "Explore remote services across all 50 US states")}</p></section>`;
      break;
    case "services":
      inner = `<h1>Digital growth services</h1>` + d.services.map(x => `<section id="${e(x.id)}"><h2>${e(x.title)}</h2>${img(x.image, x.title)}${imgs(x.gallery, x.title)}<p>${e(x.description)}</p>${list(x.capabilities)}${x.details ? mdToHtml(x.details) : ""}</section>`).join("");
      break;
    case "usa":
      inner = usaHtml(d);
      break;
    case "pricing":
      inner = `<h1>Pricing</h1>${plans(d)}${faqs(d)}<p>${a("/contact", "Request a quote")}</p>`;
      break;
    case "work":
      inner = `<h1>Selected work</h1>` + d.projects.map(p => `<article><h2>${e(p.title)}</h2><p>${e(p.category)}</p>${img(p.image, p.title)}${imgs(p.gallery, p.title)}<p>${e(p.summary)}</p></article>`).join("");
      break;
    case "blog":
      inner = `<h1>Insights &amp; guides</h1>${postList(d.posts)}`;
      break;
    case "post": {
      const p = route.post;
      inner = `<article><p>${a("/blog", "Back to insights")}</p><h1>${e(p.title)}</h1><p>${e(p.category)} · ${e(p.date)} · ${readingMinutes(p.content)} min read · By ${e(p.author || s.name)}</p><p><em>${e(p.excerpt)}</em></p>${img(p.coverImage, p.coverAlt || p.title)}${mdToHtml(p.content)}${(p.gallery || []).length ? "<h2>Gallery</h2>" + imgs(p.gallery, p.title) : ""}<p>Need help applying this to your business? ${a("/contact", "Message Smart Lead Systems")}.</p></article>`;
      break;
    }
    case "founders":
      inner = `<h1>Founder</h1>` + d.founders.map(f => `<section id="${e(f.id)}"><h2>${e(f.name)}</h2><p>${e(f.role)}</p><figure>${img(f.photo, f.photoAlt || f.name + ", " + f.role + ", founder of " + s.name)}<figcaption>${e(f.photoAlt || f.name + ", " + f.role)}. Founder of ${e(s.name)}.</figcaption></figure>${mdToHtml(f.bio)}${imgs(f.gallery, f.name + " founder")}<p>${a("/contact", "Contact Smart Lead Systems about a project")}</p></section>`).join("");
      break;
    case "contact":
      inner = `<h1>${e(s.contactTitle)} ${e(s.contactAccent)}</h1><p>${e(s.contactText)}</p><p>Email: ${a("mailto:" + s.email, s.email)}</p><p>WhatsApp: ${e(s.whatsapp)}</p><h2>We can help with</h2>${list(d.services.map(x => x.title))}`;
      break;
    case "thanks":
      inner = `<h1>${e(s.thanksTitle)}</h1><p>${e(s.thanksText)}</p><p>${a("/", "Back to the homepage")}</p>`;
      break;
    case "thanks2":
      inner = `<h1>${e(s.unqualTitle)}</h1><p>${e(s.unqualText)}</p><p>${a("/", "Back to the homepage")}</p>`;
      break;
    case "legal":
      inner = `<h1>${e(route.legal.title)}</h1>${mdToHtml(route.legal.content)}`;
      break;
    default:
      inner = `<h1>Page not found</h1><p>${a("/", "Back to the homepage")}</p>`;
  }
  return chrome(d, inner);
}
