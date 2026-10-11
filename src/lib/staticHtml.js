// Plain HTML snapshot of each page. It is injected into the page so Google and AI crawlers that
// don't run JavaScript still get the full text, links and image alt text. React replaces it in the browser.
import { escapeHtml as e, mdToHtml, readingMinutes } from "./md.js";
import { abs } from "./seo.js";

const a = (href, text) => `<a href="${e(href)}">${e(text)}</a>`;
const list = items => "<ul>" + items.map(x => `<li>${e(x)}</li>`).join("") + "</ul>";
const img = (src, alt) => src ? `<img src="${e(src)}" alt="${e(alt)}" loading="lazy"/>` : "";

function chrome(d, inner) {
  const s = d.settings;
  const nav = [["/", "Home"], ["/services", "Services"], ["/work", "Work"], ["/pricing", "Pricing"], ["/blog", "Insights"], ["/contact", "Contact"]].map(([h, t]) => a(h, t)).join(" ");
  const foot = [["/founders", "Founder"], ["/privacy", "Privacy Policy"], ["/terms", "Terms of Service"]].map(([h, t]) => a(h, t)).join(" ");
  return `<header><a href="/">${e(s.name)}</a><nav>${nav}</nav></header><main>${inner}</main><footer><p>${e(s.footerText)}</p><p>${a("mailto:" + s.email, s.email)} · ${e(s.location)}</p><nav>${foot}</nav></footer>`;
}
const faqs = d => d.faqs.length ? `<section><h2>Frequently asked questions</h2>${d.faqs.map(f => `<h3>${e(f.question)}</h3><p>${e(f.answer)}</p>`).join("")}</section>` : "";
const plans = d => d.pricing.length ? `<section><h2>${e(d.settings.pricingTitle)}</h2>${d.pricing.map(p => `<article><h3>${e(p.title)}</h3><p><strong>${e(p.price)}</strong> ${e(p.period)}</p><p>${e(p.description)}</p>${list(p.features)}</article>`).join("")}<p>${e(d.settings.pricingNote)}</p></section>` : "";
const postList = posts => posts.map(p => `<article><h3>${a("/blog/" + p.slug, p.title)}</h3><p>${e(p.category)} · ${e(p.date)}</p><p>${e(p.excerpt)}</p></article>`).join("");

export function renderStatic(route, d) {
  const s = d.settings;
  let inner = "";
  switch (route.kind) {
    case "home":
      inner = `<h1>${e(s.heroLine1)} ${e(s.heroLine2)} ${e(s.heroLine3)}</h1><p>${e(s.heroText)}</p>` +
        `<section><h2>${e(s.approachTitle)} ${e(s.approachAccent)}</h2><p>${e(s.approachText1)}</p><p>${e(s.approachText2)}</p></section>` +
        (d.industries.length ? `<section><h2>Who we help</h2>${d.industries.map(i => `<article><h3>${e(i.title)}</h3><p>${e(i.description)}</p>${list(i.points)}</article>`).join("")}</section>` : "") +
        `<section><h2>Services</h2>${d.services.map(x => `<article><h3>${a("/services#" + x.id, x.title)}</h3><p>${e(x.description)}</p></article>`).join("")}</section>` +
        `<section><h2>How we work</h2><ol>${d.process.map(x => `<li><strong>${e(x.title)}</strong>: ${e(x.description)}</li>`).join("")}</ol></section>` +
        (d.testimonials.length ? `<section><h2>What clients say</h2>${d.testimonials.map(t => `<blockquote>${e(t.quote)}<footer>${e(t.name)}${t.role ? ", " + e(t.role) : ""}</footer></blockquote>`).join("")}</section>` : "") +
        plans(d) + faqs(d) + `<section><h2>Insights</h2>${postList(d.posts.slice(0, 6))}</section><section><h2>${e(s.ctaTitle)} ${e(s.ctaAccent)}</h2><p>${e(s.ctaText)}</p><p>${a("/contact", "Contact us")}</p></section>`;
      break;
    case "services":
      inner = `<h1>Digital growth services</h1>` + d.services.map(x => `<section id="${e(x.id)}"><h2>${e(x.title)}</h2>${img(x.image, x.title)}<p>${e(x.description)}</p>${list(x.capabilities)}</section>`).join("");
      break;
    case "pricing":
      inner = `<h1>Pricing</h1>${plans(d)}${faqs(d)}<p>${a("/contact", "Request a quote")}</p>`;
      break;
    case "work":
      inner = `<h1>Selected work</h1>` + d.projects.map(p => `<article><h2>${e(p.title)}</h2><p>${e(p.category)}</p>${img(p.image, p.title)}<p>${e(p.summary)}</p></article>`).join("");
      break;
    case "blog":
      inner = `<h1>Insights &amp; guides</h1>${postList(d.posts)}`;
      break;
    case "post": {
      const p = route.post;
      inner = `<article><p>${a("/blog", "Back to insights")}</p><h1>${e(p.title)}</h1><p>${e(p.category)} · ${e(p.date)} · ${readingMinutes(p.content)} min read · By ${e(p.author || s.name)}</p><p><em>${e(p.excerpt)}</em></p>${img(p.coverImage, p.coverAlt || p.title)}${mdToHtml(p.content)}<p>Need help applying this to your business? ${a("/contact", "Message Smart Lead Systems")}.</p></article>`;
      break;
    }
    case "founders":
      inner = `<h1>Founder</h1>` + d.founders.map(f => `<section id="${e(f.id)}"><h2>${e(f.name)}</h2><p>${e(f.role)}</p>${img(f.photo, f.photoAlt || f.name + ", " + f.role)}${mdToHtml(f.bio)}</section>`).join("");
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
